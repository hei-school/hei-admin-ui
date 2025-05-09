import {teachingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const examsProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}, _meta) => {
    return teachingApi()
      .getAllExams(
        filter?.awarded_course_id,
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
    return teachingApi()
      .getExamOneExamById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payloads: any) => {
    const payload = payloads[0];
    return teachingApi()
      .createOrUpdateExamsInfos(payload)
      .then((response) => [response.data]);
  },
  delete: async () => {
    throw new Error("Not implemented");
  },
};

export default examsProvider;
