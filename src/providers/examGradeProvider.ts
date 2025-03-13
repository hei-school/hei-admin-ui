import {CrupdateGrade} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const examGradeProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number = 10,
    filter: Record<string, any> = {}
  ) {
    return teachingApi()
      .getParticipantsGradeForExam(filter?.examId, page, perPage)
      .then(({data}) => ({data}));
  },
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: CrupdateGrade, meta: Record<string, any> = {}) {
    return teachingApi()
      .crupdateParticipantGrade(meta?.examId, meta?.studentId, payload)
      .then(({data}) => ({data}));
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default examGradeProvider;
