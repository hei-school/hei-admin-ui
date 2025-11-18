import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";

// TODO: shared utility fn to unwrap axios apiClient data as .then(res => ({data: res.data})) gets repeated a million times
const retakeExamProvider: HaDataProviderType = {
  getList: async (page, perPage, filter, _meta = {}) => {
    const {studentId, sessionId, student_ref, status} = filter;
    if (!studentId || !sessionId) {
      return retakeExamApi()
        .getAllRetakeExams(
          status,
          student_ref,
          undefined,
          undefined,
          page,
          perPage
        )
        .then((response) => ({
          data: response.data,
        }));
    }
    return retakeExamApi()
      .getStudentRetakeExamBySession(studentId, sessionId, page, perPage)
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (sessionId: string, payloads) => {
    const payload = [payloads.data];
    return retakeExamApi()
      .createOrUpdateRetakeExam(sessionId, payload)
      .then((response) => response.data);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};
export default retakeExamProvider;
