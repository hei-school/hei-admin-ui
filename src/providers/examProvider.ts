import {teachingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const examsProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}, _meta) => {
    const {awardedCourseId, title} = filter;
    return teachingApi()
      .getAllExams(
        awardedCourseId,
        title,
        page,
        perPage
      )
      .then((result) => ({data: result.data}));
  },
  getOne: async (_examId: string, _meta) => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: async (payloads: any) => {
    const payload = payloads[0]
    return teachingApi()
      .createOrUpdateExamsInfos(payload)
      .then((response) => [response.data]);
  },
  delete: async () => {
    throw new Error("Not implemented");
  },
};

export default examsProvider;
