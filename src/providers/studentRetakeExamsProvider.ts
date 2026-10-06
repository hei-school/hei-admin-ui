import {
  CourseResult,
  CourseResultStatus,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {retakeExamApi} from "./api";

interface StudentRetakeExamsFilter {
  studentId: string;
  status: CourseResultStatus;
}

const studentRetakeExamsProvider: HaDataProviderType<
  CourseResult,
  StudentRetakeExamsFilter
> = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: StudentRetakeExamsFilter
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
