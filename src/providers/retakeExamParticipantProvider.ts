import {
  HaDataProviderType,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";
import {StudentRetakeExam} from "@haapi-3d601c85/typescript-client";

interface RetakeExamParticipantFilter {
  sessionId: string;
  courseId: string;
  ref: string;
}

const retakeExamParticipantProvider: HaDataProviderType<
  StudentRetakeExam,
  RetakeExamParticipantFilter
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: RetakeExamParticipantFilter
  ) => {
    const {sessionId, courseId, ref} = filter;
    return retakeExamApi()
      .getRetakeExamParticipantByCourseIdAndSessionId(
        sessionId,
        courseId,
        ref,
        page,
        perPage
      )
      .then((response) => ({
        data: response.data,
      }));
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default retakeExamParticipantProvider;
