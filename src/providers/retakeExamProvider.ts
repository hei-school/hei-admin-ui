import {HaDataProviderType} from "./HaDataProviderType";
import {retakeExamApi} from "./api";

const retakeExamProvider: HaDataProviderType = {
  getList: async (_page, _perPage, _filter, meta = {}) => {
    const {studentId, sessionId} = meta;
    if (!studentId || !sessionId) {
      throw new Error("studentId and sessionId are required in meta");
    }

    return retakeExamApi()
      .getStudentRetakeExamBySession(studentId, sessionId)
      .then((response) => ({
        data: response.data,
        total: response.data.length,
      }));
  },

  getOne: async (_id, _meta) => {
    return Error("Function not implemented");
  },

  saveOrUpdate: async (payloads: any, _meta) => {
    const exams = Array.isArray(payloads) ? payloads : [payloads];
    const sessionId = exams[0].session_id;
    if (!sessionId) {
      throw new Error("session_id est required in payload");
    }
    return retakeExamApi()
      .createOrUpdateRetakeExam(sessionId, exams)
      .then((response) => ({data: response.data}));
  },

  delete: async (_id: string) => {
    return Error("Function not implemented");
  },
};

export default retakeExamProvider;
