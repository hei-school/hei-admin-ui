import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

const retakeExamParticipantProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: {sessionId: string; courseId: string; code: string; ref: string}
  ) => {
    const {sessionId, courseId, code, ref} = filter;
    if (!sessionId) {
      return {data: []};
    }
    if (!courseId) {
      return retakeExamApi()
        .getRetakeExamCoursesBySessionId(sessionId, code)
        .then((response) => ({
          data: response.data,
        }));
    }
    return retakeExamApi()
      .getRetakeExamParticipantByCourseIdAndSessionId(sessionId, courseId, ref)
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
