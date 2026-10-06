import {Course} from "@haapi-b0fc7615/typescript-client";
import {retakeExamApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

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

export default retakeExamCoursesProvider;
