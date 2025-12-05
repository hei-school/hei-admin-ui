import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";
import {RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";

interface RetakeExamFilter {
  studentId?: string;
  sessionId?: string;
  student_ref?: string;
  status?: RetakeExamStatus[];
}

interface RetakeExamPayload {
  id: string;
  status: RetakeExamStatus;
  currentStatus?: RetakeExamStatus;
  course_id?: string;
  session_id?: string;
  student_id?: string;
  reason?: string;
}

type TransitionKey = `${RetakeExamStatus}_TO_${RetakeExamStatus}`;

const createTransitionHandler = (id: string, reason?: string) => ({
  [`${RetakeExamStatus.REGISTERED}_TO_${RetakeExamStatus.TO_CANCEL}`]: () =>
    retakeExamApi().requestToCancelRetakeExams([
      {retake_exam_id: id, reason: reason ?? ""},
    ]),

  [`${RetakeExamStatus.TO_CANCEL}_TO_${RetakeExamStatus.REGISTERED}`]: () =>
    retakeExamApi().rejectToCancelRetakeExamRequests([
      {retake_exam_id: id, reason: reason ?? ""},
    ]),

  [`${RetakeExamStatus.TO_CANCEL}_TO_${RetakeExamStatus.CANCELED}`]: () =>
    retakeExamApi().cancelRetakeExams([{retake_exam_id: id}]),
});

const getTransitionKey = (
  from?: RetakeExamStatus,
  to?: RetakeExamStatus
): TransitionKey | null =>
  from && to ? (`${from}_TO_${to}` as TransitionKey) : null;

const retakeExamProvider: HaDataProviderType = {
  getList: async (page, perPage, filter: RetakeExamFilter) => {
    const {studentId, sessionId, student_ref, status} = filter;
    const hasStudentAndSession = Boolean(studentId && sessionId);

    const response = hasStudentAndSession
      ? await retakeExamApi().getStudentRetakeExamBySession(
          studentId!,
          sessionId!,
          page,
          perPage
        )
      : await retakeExamApi().getAllRetakeExams(
          status,
          student_ref,
          undefined,
          undefined,
          page,
          perPage
        );

    return {data: response.data};
  },
  getOne: () => {
    throw new Error("Not implemented");
  },

  saveOrUpdate: async (
    sessionIdOrCurrentStatus: string,
    payloads: {data: RetakeExamPayload}
  ) => {
    const {status: targetStatus, currentStatus, id, reason} = payloads.data;
    const transitionKey = getTransitionKey(currentStatus, targetStatus);

    const response = transitionKey
      ? await createTransitionHandler(id, reason)[transitionKey]()
      : await retakeExamApi().createOrUpdateRetakeExam(
          sessionIdOrCurrentStatus,
          [payloads.data]
        );

    return response.data;
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default retakeExamProvider;
