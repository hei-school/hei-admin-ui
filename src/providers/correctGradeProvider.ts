import {gradesApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {UpdateGrade} from "@haapi-b0fc7615/typescript-client";

const correctGradeProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number,
    filter = {},
    meta: Record<string, any> = {}
  ) {
    const {gradeId} = meta;
    return gradesApi()
      .getOrderedGradeHistory(
        gradeId,
        page,
        perPage,
        filter?.from,
        filter?.to,
        filter?.comment
      )
      .then(({data}) => ({data}));
  },
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: UpdateGrade, meta: Record<string, any> = {}) {
    const {examId, studentId} = meta;

    if (!examId || !studentId) {
      throw new Error("examId and studentId are required in meta");
    }

    if (!payload.comment) {
      throw new Error("Comment is required to correct a grade");
    }

    return gradesApi()
      .correctParticipantGrade(examId, studentId, payload)
      .then(({data}) => ({data}));
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default correctGradeProvider;
