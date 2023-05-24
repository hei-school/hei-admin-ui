import { teachingApi } from "./api";
import { HaDataProviderType } from "./HaDataProviderType";

const gradeProvider: HaDataProviderType = {
  async getList(page: number, pageSize: number, filter: any) {
    const result = await teachingApi().getStudentGrades(
      filter.studentId ? filter.studentId : "..."
    );
    return result.data;
  },
  async getOne(studentId: string) {
    throw new Error("Function not implemented.");
  },
  async saveOrUpdate(resources: any) {
    throw new Error("Function not implemented.");
  },
};

export default gradeProvider;
