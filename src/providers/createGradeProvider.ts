import {HaDataProviderType} from "@/providers/HaDataProviderType.ts";
import {gradesApi} from "@/providers/api";
import {CreateGrade} from "@haapi/typescript-client";

const createGradeProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: CreateGrade, meta: Record<string, any> = {}) {
    const {examId, studentId} = meta;
    return gradesApi()
      .createParticipantGrade(examId, studentId, {
        score: payload.score,
      })
      .then(({data}) => ({data}));
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default createGradeProvider;
