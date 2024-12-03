import {v4 as uuid} from "uuid";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";
import authProvider from "./authProvider";

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
  async getList(page: number, perPage: number, filter: any) {
    const {data: fees} = filter.studentId
      ? await payingApi().getStudentFees(
          filter.studentId,
          page,
          perPage,
          filter.status
        )
      : await payingApi().getFees(
          filter.status,
          filter.monthFrom,
          filter.monthTo,
          page,
          perPage,
          filter.isMpbs,
          filter.student_ref
        );

    return {
      data: fees.map((fee) => {
        return {
          ...fee,
          id: toRaId(fee.student_id as string, fee.id as string),
        };
      }),
    };
  },

  async getOne(raId: string) {
    const {studentId, feeId} = toApiIds(raId);
    const result = await payingApi().getStudentFeeById(studentId, feeId);
    return {...result.data, id: raId};
  },

  async saveOrUpdate(resources: Array<any>) {
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

      return await payingApi()
        .crupdateMpbs(mpbs?.student_id, mpbs?.fee_id, mpbs)
        .then((result) => [{...result.data, ...payload}]);
    }
    if (role === WhoamiRoleEnum.STUDENT) {
      return await payingApi()
        .createStudentFees(payload[0].student_id, payload)
        .then((result) => result.data);
    }
    if (role === WhoamiRoleEnum.MANAGER || role === WhoamiRoleEnum.ADMIN) {
      return await payingApi()
        .crupdateStudentFees(payload)
        .then((result) => result.data);
    }
  },
  async delete(raId: string) {
    const {studentId, feeId} = toApiIds(raId);
    return await payingApi()
      .deleteStudentFeeById(feeId, studentId)
      .then((response) => response.data);
  },
};

export default feeProvider;
