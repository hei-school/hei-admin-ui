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
  saveOrUpdate: async (payload) => {
    const payloads = payload[0];
    return retakeExamApi()
      .createOrUpdateRetakeExamSessions(payloads)
      .then((response) => [response.data]);
  },

  async delete() {
    throw new Error("Not implemented");
  },
};

export default retakeExamSessionProvider;
