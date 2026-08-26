import {
  ArchiveStatusEnum,
  Fee,
  FeeCategory,
  FeeStatusEnum,
  FeeTypeEnum,
  MpbsStatus,
  WhoamiRoleEnum,
} from "@haapi-3d601c85/typescript-client";
import {v4 as uuid} from "uuid";
import {payingApi} from "./api";
import authProvider from "./authProvider";
import {HaDataProviderType} from "./HaDataProviderType";

// The fees API has no server-side archive_status filter, so filtering by it
// is done client-side over a broad, single page of fees.
const MAX_FEES_FOR_ARCHIVE_STATUS_FILTER = 500;

const raSeparator = "--";
const toRaId = (studentId: string, feeId: string): string =>
  studentId + raSeparator + feeId;

export const toApiIds = (raId: string = "") => {
  const ids = raId.split(raSeparator);
  return {studentId: ids[0], feeId: ids[1]};
};

export const studentIdFromRaId = (raId: string): string =>
  toApiIds(raId).studentId;

export const feeIdFromRaId = (raId: string): string => toApiIds(raId).feeId;

const feeProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {
      transaction_status?: MpbsStatus;
      type?: FeeTypeEnum;
      status?: FeeStatusEnum;
      category?: FeeCategory;
      monthFrom?: Date;
      monthTo?: Date;
      isMpbs?: boolean;
      student_ref?: string;
      studentId?: string;
      archive_status?: ArchiveStatusEnum;
    }
  ) => {
    const doGetFees = async () => {
      if (filter.studentId) {
        return payingApi()
          .getFeesByStudentId(filter.studentId, page, perPage, filter.status)
          .then(({data}) => data);
      }
      if (filter.archive_status) {
        const {
          data: {data: allFees},
        } = await payingApi().getFees(
          filter.transaction_status,
          filter.type,
          filter.status,
          filter.category,
          filter.monthFrom,
          filter.monthTo,
          1,
          MAX_FEES_FOR_ARCHIVE_STATUS_FILTER,
          filter.isMpbs,
          filter.student_ref
        );
        const matchingFees = (allFees ?? []).filter(
          (fee) => fee.archive_status === filter.archive_status
        );
        return matchingFees.slice((page - 1) * perPage, page * perPage);
      }
      return payingApi()
        .getFees(
          filter.transaction_status,
          filter.type,
          filter.status,
          filter.category,
          filter.monthFrom,
          filter.monthTo,
          page,
          perPage,
          filter.isMpbs,
          filter.student_ref
        )
        .then(({data: {data: fees}}) => fees!);
    };

    const fees: Fee[] = await doGetFees();

    return {
      // A fee without an id or a student_id cannot produce a usable RA
      // record id (needed for the show/edit/archive routes), so it is
      // dropped rather than risk building a broken link that crashes on
      // navigation. Logged so a backend/data issue can be spotted.
      data: fees
        .filter((fee: Fee) => {
          const isUsable = Boolean(fee.id) && Boolean(fee.student_id);
          if (!isUsable) {
            console.warn(
              "feeProvider: skipping a fee missing id or student_id",
              fee
            );
          }
          return isUsable;
        })
        .map((fee: Fee) => ({
          ...fee,
          id: toRaId(fee.student_id!, fee.id!),
        })),
    };
  },

  getOne: async (raId: string) => {
    const {studentId, feeId} = toApiIds(raId);
    if (!studentId || !feeId) {
      throw new Error(
        `Identifiant de frais invalide : "${raId}" (impossible d'en extraire l'étudiant et le frais).`
      );
    }
    return payingApi()
      .getStudentFeeById(studentId, feeId)
      .then((result) => ({
        ...result.data,
        id: raId,
      }));
  },

  saveOrUpdate: async (resources) => {
    const payload = resources[0];
    const role = authProvider.getCachedRole();

    if (payload?.psp_id) {
      const feeId = toApiIds(payload?.fee_id).feeId;

      const mpbs = {
        id: payload.mpbs_id ?? uuid(),
        student_id: payload?.student_id,
        fee_id: feeId,
        psp_id: payload?.psp_id,
        psp_type: payload?.psp_type,
      };

      return payingApi()
        .crupdateMpbs(mpbs?.student_id, mpbs?.fee_id, mpbs)
        .then((result) => [{...result.data, ...payload}]);
    }
    if (role === WhoamiRoleEnum.STUDENT) {
      return payingApi()
        .createStudentFees(payload[0].student_id, payload)
        .then((result) => result.data);
    }
    if (role === WhoamiRoleEnum.MANAGER || role === WhoamiRoleEnum.ADMIN) {
      return payingApi()
        .crupdateStudentFees(payload)
        .then((result) => result.data);
    }
  },
  delete: async (raId: string) => {
    const {studentId, feeId} = toApiIds(raId);
    return payingApi()
      .deleteStudentFeeById(feeId, studentId)
      .then((response) => response.data);
  },
};

export default feeProvider;
