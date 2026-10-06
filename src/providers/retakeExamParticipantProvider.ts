import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";
import {StudentRetakeExam} from "@haapi-b0fc7615/typescript-client";

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
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default retakeExamParticipantProvider;
