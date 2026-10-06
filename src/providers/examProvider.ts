import {useRole} from "@/security/hooks";
import {CrupdateExam, Exam} from "@haapi-b0fc7615/typescript-client";
import {examApi} from "./api";
import authProvider from "./authProvider";
import {HaDataProviderType, HaMeta} from "./HaDataProviderType";

interface ExamFilter {
  teacher_id?: string;
  title?: string;
  course_code?: string;
  group_ref?: string[];
  examination_date_from?: Date;
  examination_date_to?: Date;
}

const examsProvider: HaDataProviderType<
  Exam,
  ExamFilter,
  HaMeta,
  CrupdateExam[]
> = {
  getList: async (page, perPage, filter = {}) => {
    const {isAdmin, isManager, isTeacher} = useRole();

    const teacher_id =
      isAdmin() || isManager()
        ? filter.teacher_id
        : isTeacher()
          ? authProvider.getCachedWhoami().id!
          : undefined;
    return examApi()
      .getAllExams(
        teacher_id,
        filter?.title,
        filter?.course_code,
        filter?.group_ref,
        filter?.examination_date_from,
        filter?.examination_date_to,
        page,
        perPage
      )
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return examApi()
      .getExamOneExamById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payloads) => {
    const payload = payloads[0];
    return examApi()
      .createOrUpdateExamsInfos(payload)
      .then((response) => [response.data]);
  },
  delete: async () => {
    throw new Error("Not implemented");
  },
};

export default examsProvider;
