import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const examGradeProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number = 10,
    filter: Record<string, any> = {}
  ) {
    const {examId} = filter || {};
    return teachingApi()
      .getParticipantsGradeForExam(examId, page, perPage)
      .then(({data}) => ({data}));
  },
  getOne() {
    throw new Error("Not implemented");
  },
  saveOrUpdate() {
    throw new Error("Not implemented");
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default examGradeProvider;
