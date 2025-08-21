import {gradesApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType.ts";
import {UpdateGrade} from "@haapi/typescript-client";

const correctGradeProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: UpdateGrade, meta: Record<string, any> = {}) {
    const {examId, studentId} = meta;

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
