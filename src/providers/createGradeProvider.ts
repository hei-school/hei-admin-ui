import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {gradesApi} from "@/providers/api";
import {CreateGrade} from "@haapi-b0fc7615/typescript-client";

const createGradeProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: CreateGrade, meta = {}) {
    const {examId, studentId} = meta;

    if (!examId || !studentId) {
      throw new Error("examId and studentId are required in meta");
    }

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
