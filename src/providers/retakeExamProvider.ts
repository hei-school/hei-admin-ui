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
  getOne: async (_id, _meta) => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (sessionId: string, payloads) => {
    const payload = payloads[0];
    return retakeExamApi()
      .createOrUpdateRetakeExam(sessionId, payload)
      .then((response) => [response.data]);
  },
  delete: async () => {
    throw new Error("Not implemented");
  },
};
export default retakeExamProvider;
