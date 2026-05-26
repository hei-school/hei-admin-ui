import {CourseResultStatus} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {gradesApi} from "./api";

const studentRetakeExamsProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: {studentId: string; status: CourseResultStatus}
  ) => {
    const {studentId, status} = filter;
    return gradesApi()
      .getListStudentRetakeExams(studentId, status)
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: () => {
    throw new Error("Function not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default studentRetakeExamsProvider;
