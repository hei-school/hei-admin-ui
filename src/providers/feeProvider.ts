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
    const fees = resources[0];
    const role = authProvider.getCachedRole();

    if (fees?.psp_id) {
      const fee = fees;

      const feeId = toApiIds(fee?.id).feeId;

      const createMpbs = {
        student_id: fee?.student_id,
        fee_id: feeId,
        psp_id: fee?.psp_id,
        psp_type: fee?.psp_type,
      };

      return await payingApi()
        .createMpbs(createMpbs?.student_id, createMpbs?.fee_id, createMpbs)
        .then((result) => [{...result.data, ...fee}]);
    }
    console.log("role jhejhejheh", role);
    if (role === WhoamiRoleEnum.STUDENT) {
      return await payingApi()
        .createStudentFees(fees[0].student_id, fees)
        .then((result) => result.data);
    }
    if (role === WhoamiRoleEnum.MANAGER) {
      return await payingApi()
        .crupdateStudentFees(fees)
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
