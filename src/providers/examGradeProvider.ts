import {
  Grade,
  StudentGrade,
  UpdateGrade,
} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, HaSaveParams} from "./HaDataProviderType";
import {gradesApi} from "./api";

interface ExamGradeFilter {
  student_ref?: string;
}

interface ExamGradeMeta {
  examId?: string;
  studentId?: string;
}

// examId arrive dans meta via dataProvider.update, à la racine sinon
type ExamGradeSaveParams = HaSaveParams<ExamGradeMeta> & {examId?: string};

type ExamGradeRecord = StudentGrade & {id?: string};

// getOne renvoie la note enveloppée dans {data}
type ExamGradeResource = ExamGradeRecord | {data: Grade};

const examGradeProvider: HaDataProviderType<
  ExamGradeResource,
  ExamGradeFilter,
  ExamGradeMeta,
  UpdateGrade[],
  ExamGradeSaveParams,
  StudentGrade[][]
> = {
  getList: async (
    page: number,
    perPage: number = 10,
    filter: ExamGradeFilter,
    meta: ExamGradeMeta = {}
  ) => {
    const examId = meta?.examId;
    return gradesApi()
      .getStudentGradesForExam(examId!, page, perPage, filter?.student_ref)
      .then(({data = []}: {data?: StudentGrade[]}) => ({
        data: data.map((value: StudentGrade) => ({
          ...value,
          id: value?.grade?.id,
        })),
      }));
  },
  saveOrUpdate: async (
    payload: UpdateGrade[],
    meta: ExamGradeSaveParams = {}
  ) => {
    const examId = meta?.meta?.examId ?? meta?.examId;
    return gradesApi()
      .correctParticipantsGradeForExam(examId!, payload)
      .then(({data}) => [data]);
  },
  getOne: async (id: string, meta: {studentId: string}) => {
    return gradesApi()
      .getParticipantGrade(id, meta?.studentId)
      .then(({data}) => ({data}));
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default examGradeProvider;
