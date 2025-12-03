import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";
import {RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";

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
  saveOrUpdate: async (sessionIdOrCurrentStatus: string, payloads) => {
    const data = payloads.data;
    const targetStatus = data.status;
    const currentStatus = data.currentStatus;
    const retakeExamId = data.id;
    const reason = data.reason;
    if (
      currentStatus === RetakeExamStatus.REGISTERED &&
      targetStatus === RetakeExamStatus.TO_CANCEL
    ) {
      const payload = [
        {
          retake_exam_id: retakeExamId,
          reason: reason,
        },
      ];
      return retakeExamApi()
        .requestToCancelRetakeExams(payload)
        .then((response) => response.data);
    }
    if (
      currentStatus === RetakeExamStatus.TO_CANCEL &&
      targetStatus === RetakeExamStatus.REGISTERED
    ) {
      const payload = [
        {
          retake_exam_id: retakeExamId,
          reason: reason,
        },
      ];
      return retakeExamApi()
        .rejectToCancelRetakeExamRequests(payload)
        .then((response) => response.data);
    }
    if (
      currentStatus === RetakeExamStatus.TO_CANCEL &&
      targetStatus === RetakeExamStatus.CANCELED
    ) {
      const payload = [
        {
          retake_exam_id: retakeExamId,
        },
      ];
      return retakeExamApi()
        .cancelRetakeExams(payload)
        .then((response) => response.data);
    }
    const sessionId = sessionIdOrCurrentStatus;
    const payload = [data];
    return retakeExamApi()
      .createOrUpdateRetakeExam(sessionId, payload)
      .then((response) => response.data);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default retakeExamProvider;
