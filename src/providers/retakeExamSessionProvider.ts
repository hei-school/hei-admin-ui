import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

const retakeExamSessionProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {title: string; to: Date}
  ) => {
    const {title, to} = filter;
    return retakeExamApi()
      .getRetakeExamSessions(title, undefined, undefined, to, page, perPage)
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
