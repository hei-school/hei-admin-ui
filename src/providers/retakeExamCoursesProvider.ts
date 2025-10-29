import {retakeExamApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const retakeExamCoursesProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {sessionId: string; code: string}
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
