import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

// TODO: shared utility fn to unwrap axios apiClient data as .then(res => ({data: res.data})) gets repeated a million times
const retakeExamProvider: HaDataProviderType = {
  getList: async (_page, _perPage, filter, _meta = {}) => {
    const {studentId, sessionId} = filter;
    return retakeExamApi()
      .getStudentRetakeExamBySession(studentId, sessionId)
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (sessionId: string, payloads: any[]) => {
    return retakeExamApi()
      .createOrUpdateRetakeExam(sessionId, payloads)
      .then((response) => ({data: response.data}));
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};
export default retakeExamProvider;
