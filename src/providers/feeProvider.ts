import {payingApi} from "./api";
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

const feeProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const {data: fees} = filter.studentId
      ? await payingApi().getStudentFees(filter.studentId, page, perPage)
      : await payingApi().getFees(filter.status, page, perPage, filter.isMpbs);

    return fees.map(({mpbs, ...fee}) => {
      return {
        ...fee,
        id: toRaId(fee.student_id as string, fee.id as string),
      };
    });
  },

  async getOne(raId: string) {
    const {studentId, feeId} = toApiIds(raId);
    const result = await payingApi().getStudentFeeById(studentId, feeId);
    return {...result.data, id: raId};
  },

  async saveOrUpdate(resources: Array<any>) {
    const {psp_id, psp_type, ...fee} = resources[0];

    const feeId = toApiIds(fee?.id).feeId;

    const createMpbs = {
      student_id: fee?.student_id,
      fee_id: feeId,
      psp_id: psp_id,
      psp_type: psp_type,
    };

    if (psp_id) {
      return await payingApi()
        .createMpbs(createMpbs?.student_id, createMpbs?.fee_id, createMpbs)
        .then((result) => [{...result.data, ...fee}]);
    }

    return await payingApi()
      .createStudentFees(fee?.student_id, fee)
      .then((result) => result.data);
  },
  async delete(raId: string) {
    const {studentId, feeId} = toApiIds(raId);
    return await payingApi()
      .deleteStudentFeeById(feeId, studentId)
      .then((response) => response.data);
  },
};

export default feeProvider;
