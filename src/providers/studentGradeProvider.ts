import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const studentGradeProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number = 10,
    filter: Record<string, any> = {}
  ) {
    return teachingApi()
      .getStudentGrades(filter?.studentId, page, perPage)
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

export default studentGradeProvider;
