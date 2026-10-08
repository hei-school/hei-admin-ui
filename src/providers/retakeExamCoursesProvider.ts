import {Course} from "@haapi-b0fc7615/typescript-client";
import {retakeExamApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";

interface RetakeExamCoursesFilter {
  sessionId: string;
  code: string;
}

const retakeExamCoursesProvider: HaDataProviderType<
  Course,
  RetakeExamCoursesFilter
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: RetakeExamCoursesFilter
  ) => {
    const {sessionId, code} = filter;
    return retakeExamApi()
      .getRetakeExamCoursesBySessionId(sessionId, code, page, perPage)
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default retakeExamCoursesProvider;
