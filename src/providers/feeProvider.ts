import {
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
    }
  ) => {
    const doGetFees = async () => {
      if (filter.studentId) {
        return payingApi()
          .getFeesByStudentId(filter.studentId, page, perPage, filter.status)
          .then(({data}) => data);
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
      data: fees.map((fee: Fee) => ({
        ...fee,
        id: toRaId(fee.student_id!, fee.id!),
      })),
    };
  },

  getOne: async (raId: string) => {
    const {studentId, feeId} = toApiIds(raId);
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
