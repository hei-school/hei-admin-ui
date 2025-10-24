import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

const retakeExamParticipantProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {sessionId: string; courseId: string; code: string; ref: string}
  ) => {
    const {sessionId, courseId, code, ref} = filter;
    if (!sessionId) {
      return {data: []};
    }
    if (!courseId) {
      return retakeExamApi()
        .getRetakeExamCoursesBySessionId(sessionId, code, page, perPage)
        .then((response) => ({
          data: response.data,
        }));
    }
    return retakeExamApi()
      .getRetakeExamParticipantByCourseIdAndSessionId(
        sessionId,
        courseId,
        ref,
        page,
        perPage
      )
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default retakeExamParticipantProvider;
