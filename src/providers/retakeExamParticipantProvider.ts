import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

const retakeExamParticipantProvider: HaDataProviderType = {
  getList: async (_page: number, _perPage: number, filter: any) => {
    const {sessionId} = filter;
    return retakeExamApi()
      .getRetakeExamCoursesBySessionId(sessionId)
      .then((response) => ({data: response.data}));
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
