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
  getOne: () => {
    throw new Error("Not impemented");
  },
  saveOrUpdate: async (payload) => {
    console.log(payload);
    return retakeExamApi()
      .createOrUpdateRetakeExamSessions(payload)
      .then((response) => ({data: response.data}));
  },

  async delete() {
    throw new Error("Not implemented");
  },
};

export default retakeExamSessionProvider;
