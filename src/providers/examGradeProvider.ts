import {StudentGrade, UpdateGrade} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {gradesApi} from "./api";

const examGradeProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number = 10,
    filter?: any,
    meta: Record<string, any> = {}
  ) => {
    return gradesApi()
      .getStudentGradesForExam(meta?.examId, page, perPage, filter?.student_ref)
      .then(({data = []}: {data?: StudentGrade[]}) => ({
        data: data.map((value: StudentGrade) => ({
          ...value,
          id: value?.grade?.id,
        })),
      }));
  },
  saveOrUpdate: async (
    payload: UpdateGrade[],
    meta: Record<string, any> = {}
  ) => {
    const examId = meta?.meta?.examId ?? meta?.examId;
    return gradesApi()
      .correctParticipantsGradeForExam(examId, payload)
      .then(({data}) => [data]);
  },
  getOne: async (id: string, meta: Record<string, any>) => {
    return gradesApi()
      .getParticipantGrade(id, meta?.studentId)
      .then(({data}) => ({data}));
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default examGradeProvider;
