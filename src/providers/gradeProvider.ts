import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {gradesApi} from "@/providers/api";
import {v4 as uuid} from "uuid";

const gradeProvider: HaDataProviderType = {
  getList: async (_page, _perPage, filter = {}) => {
    const {studentId, studentLevel} = filter;

    return gradesApi()
      .getYearlyResult(studentId, studentLevel)
      .then((response) => ({data: response.data.course_results || []}));
  },
  getOne: async (id: string, meta = {}) => {
    const {studentLevel} = meta;
    return gradesApi()
      .getYearlyResult(id, studentLevel)
      .then((response) => ({id: uuid(), ...response.data}));
  },
  saveOrUpdate() {
    throw new Error("Not implemented");
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default gradeProvider;
