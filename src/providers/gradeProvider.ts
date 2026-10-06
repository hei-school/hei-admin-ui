import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {gradesApi} from "@/providers/api";
import {
  CourseResult,
  StudentLevel,
  YearlyResult,
} from "@haapi-b0fc7615/typescript-client";
import {v4 as uuid} from "uuid";

interface GradeFilter {
  studentId?: string;
  studentLevel?: StudentLevel;
}

interface GradeMeta {
  studentLevel?: StudentLevel;
}

// la liste renvoie les résultats par cours, getOne le résultat annuel
type GradeResource = CourseResult | (YearlyResult & {id: string});

const gradeProvider: HaDataProviderType<GradeResource, GradeFilter, GradeMeta> =
  {
    getList: async (_page, _perPage, filter = {}) => {
      const {studentId, studentLevel} = filter;

      return gradesApi()
        .getYearlyResult(studentId!, studentLevel!)
        .then((response) => ({data: response.data.course_results || []}));
    },
    getOne: async (id: string, meta = {}) => {
      const {studentLevel} = meta;
      return gradesApi()
        .getYearlyResult(id, studentLevel!)
        .then((response) => ({id: uuid(), ...response.data}));
    },
    saveOrUpdate: () => {
      throw new Error("Not implemented");
    },
    delete: () => {
      throw new Error("Not implemented");
    },
  };

export default gradeProvider;
