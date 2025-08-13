import {gradesApi} from "./api";
import {HaDataProviderType, HaListResponseType} from "./HaDataProviderType";

const gradesDetailsProvider: HaDataProviderType = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: any,
    _meta?: any
  ): Promise<HaListResponseType> => {
    return gradesApi()
      .getCourseGrades(filter.studentId, filter.courseId)
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string, meta = {}) => {
    return gradesApi()
      .getYearlyResultTranscript(id, meta.studentLevel)
      .then((result) => result.data);
  },
  saveOrUpdate: () => {
    throw new Error("Function not implemented.");
  },
  delete: () => {
    throw new Error("Function not implemented.");
  },
};

export default gradesDetailsProvider;
