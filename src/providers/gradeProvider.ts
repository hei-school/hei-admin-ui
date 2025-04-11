import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {teachingApi} from "@/providers/api";
import {CrupdateGrade} from "@haapi/typescript-client";

const gradeProvider: HaDataProviderType = {
  getList() {
    throw new Error("Not implemented");
  },
  getOne() {
    throw new Error("Not implemented");
  },
  async saveOrUpdate(payload: CrupdateGrade, meta: Record<string, any> = {}) {
    return teachingApi()
      .crupdateParticipantGrade(meta?.examId, meta?.student_id, payload)
      .then(({data}) => ({data}));
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default gradeProvider;
