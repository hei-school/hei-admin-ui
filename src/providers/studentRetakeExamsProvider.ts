import {
  CourseResult,
  CourseResultStatus,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
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
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default studentRetakeExamsProvider;
