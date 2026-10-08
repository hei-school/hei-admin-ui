import {
  Grade,
  StudentLevel,
  YearlyResultGenerationTranscript,
} from "@haapi-b0fc7615/typescript-client";
import {gradesApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";

interface GradesDetailsFilter {
  studentId: string;
  courseId: string;
}

interface GradesDetailsMeta {
  studentLevel?: StudentLevel;
}

// la liste renvoie les notes d'un cours, getOne le relevé de l'année
type GradesDetailsResource = Grade | YearlyResultGenerationTranscript;

const gradesDetailsProvider: HaDataProviderType<
  GradesDetailsResource,
  GradesDetailsFilter,
  GradesDetailsMeta
> = {
  getList: async (
    _page: number,
    _perPage: number,
    filter: GradesDetailsFilter
  ) => {
    return gradesApi()
      .getCourseGrades(filter.studentId, filter.courseId)
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string, meta = {}) => {
    return gradesApi()
      .getYearlyResultTranscript(id, meta.studentLevel!)
      .then((result) => result.data);
  },
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default gradesDetailsProvider;
