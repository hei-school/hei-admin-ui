import {UpdateGrade} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {gradesApi} from "./api";

const examGradeProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number = 10,
    _filter?: any,
    meta: Record<string, any> = {}
  ) {
    return gradesApi()
      .getParticipantsGradeForExam(meta?.examId, page, perPage)
      .then(({data = []}) => ({
        data: data.map((value) => ({...value, id: value?.grade?.id})),
      }));
  },
  async saveOrUpdate(payload: UpdateGrade[], meta: Record<string, any> = {}) {
    return gradesApi()
      .updateParticipantsGradeForExam(meta?.examId, payload)
      .then(({data}) => ({data}));
  },
  async getOne(id: string, meta: Record<string, any>) {
    return gradesApi()
      .getParticipantGrade(id, meta?.studentId)
      .then(({data}) => ({data}));
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default examGradeProvider;
