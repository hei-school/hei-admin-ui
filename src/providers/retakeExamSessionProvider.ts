import {HaDataProviderType, HaMeta} from "@/providers/HaDataProviderType";
import {retakeExamApi} from "@/providers/api";
import {
  RetakeExamSession,
  StudentLevel,
} from "@haapi-b0fc7615/typescript-client";

interface RetakeExamSessionFilter {
  title: string;
  student_level: StudentLevel[];
}

const retakeExamSessionProvider: HaDataProviderType<
  RetakeExamSession,
  RetakeExamSessionFilter,
  HaMeta,
  RetakeExamSession[]
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: RetakeExamSessionFilter
  ) => {
    const {title, student_level} = filter;
    return retakeExamApi()
      .getRetakeExamSessions(
        title,
        student_level,
        undefined,
        undefined,
        page,
        perPage
      )
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
