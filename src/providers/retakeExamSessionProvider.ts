import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

const retakeExamSessionProvider: HaDataProviderType = {
  getList: async () => {
    return retakeExamApi()
      .getRetakeExamSessions()
      .then((response) => ({
        data: response.data,
      }));
  },
  // TODO: show all students for one session
  getOne: () => {
    throw new Error("Not impemented");
  },
  saveOrUpdate: async (payload = []) => {
    if (payload.length === 0) {
      return [];
    }
    const firstRetakeExam = payload[0];
    return retakeExamApi()
      .createOrUpdateRetakeExamSessions(firstRetakeExam)
      .then((response) => [response.data]);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default retakeExamSessionProvider;
