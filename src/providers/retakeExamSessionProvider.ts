import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

const retakeExamSessionProvider: HaDataProviderType = {
  getList: async (_page: number, _perPage: number, filter: {title: string}) => {
    const {title} = filter;
    return retakeExamApi()
      .getRetakeExamSessions(title)
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: async (id) => {
    return retakeExamApi()
      .getRetakeExamSessionById(id)
      .then((response) => response.data);
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
