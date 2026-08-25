import {CourseResultStatus} from "@haapi-3d601c85/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {retakeExamApi} from "./api";

const studentRetakeExamsProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: {studentId: string; status: CourseResultStatus}
  ) => {
    const {studentId, status} = filter;
    return retakeExamApi()
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
