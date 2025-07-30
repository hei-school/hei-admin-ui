import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {gradesApi} from "@/providers/api";
import {CrupdateGrade} from "@haapi/typescript-client";

const gradeProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: CrupdateGrade, meta: Record<string, any> = {}) {
    return gradesApi()
      .crupdateParticipantGrade(meta?.examId, meta?.studentId, payload)
      .then(({data}) => ({data}));
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default gradeProvider;
