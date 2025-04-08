import {UpdateGrade} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const examGradeProvider: HaDataProviderType = {
  async getList(
    page: number,
    perPage: number = 10,
    _filter?: any,
    meta: Record<string, any> = {}
  ) {
    return teachingApi()
      .getParticipantsGradeForExam(meta?.examId, page, perPage)
      .then(({data = []}) => ({
        data: data.map((value) => ({...value, id: value?.grade?.id})),
      }));
  },
  async saveOrUpdate(payload: UpdateGrade[], meta: Record<string, any> = {}) {
    return teachingApi()
      .updateParticipantsGradeForExam(meta?.examId, payload)
      .then(({data}) => ({data}));
  },
  getOne() {
    throw new Error("Not implemented");
  },
  delete() {
    throw new Error("Not implemented");
  },
};

export default examGradeProvider;
