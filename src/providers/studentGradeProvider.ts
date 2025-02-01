import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const studentGradeProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number = 10,
    filter: Record<string, any> = {}
  ) {
    const {studentId} = filter || {};
    return teachingApi()
      .getStudentGrades(studentId, page, perPage)
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
