import {teachingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const examsProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}, _meta) => {
    const {
      awarded_course_id, 
      title, 
      course_code, 
      group_ref, 
      examination_date_from, 
      examination_date_to
    } = filter;
    return teachingApi()
      .getAllExams(
        awarded_course_id, 
        title, 
        course_code, 
        group_ref, 
        examination_date_from, 
        examination_date_to, 
        page, 
        perPage
      ).then((result) => ({data: result.data}));
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
