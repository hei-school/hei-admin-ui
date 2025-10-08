import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {coursesApi, retakeExamApi} from "@/providers/api";

const retakeExamParticipantProvider: HaDataProviderType = {
  getList: async (_page: number, _perPage: number, filter: any) => {
    const {sessionId, courseId} = filter;
    if (sessionId && !courseId) {
      return retakeExamApi()
        .getRetakeExamCoursesBySessionId(sessionId)
        .then((response) => ({
          data: response.data,
        }));
    }
    if (sessionId && courseId) {
      return retakeExamApi()
        .getRetakeExamParticipantByCourseIdAndSessionId(sessionId, courseId)
        .then((response) => ({
          data: response.data,
        }));
    }
    return {data: []};
  },
  async getOne(courseId: string) {
    return coursesApi()
      .getCourseById(courseId)
      .then((response) => response.data);
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default retakeExamParticipantProvider;
