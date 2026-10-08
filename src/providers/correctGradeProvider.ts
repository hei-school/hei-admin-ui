import {gradesApi} from "@/providers/api";
import {
  HaDataProviderType,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {
  Grade,
  GradeHistory,
  UpdateGrade,
} from "@haapi-b0fc7615/typescript-client";

interface GradeHistoryFilter {
  from?: Date;
  to?: Date;
  comment?: string;
}

interface GradeHistoryMeta {
  gradeId?: string;
}

// second argument de saveOrUpdate pour la note d'un participant à un examen
export interface ParticipantGradeParams {
  examId?: string;
  studentId?: string;
}

const correctGradeProvider: HaDataProviderType<
  GradeHistory,
  GradeHistoryFilter,
  GradeHistoryMeta,
  UpdateGrade,
  ParticipantGradeParams,
  {data: Grade}
> = {
  async getList(
    page: number,
    perPage: number,
    filter: GradeHistoryFilter = {},
    meta: GradeHistoryMeta = {}
  ) {
    const {gradeId} = meta;
    return gradesApi()
      .getOrderedGradeHistory(
        gradeId!,
        page,
        perPage,
        filter?.from,
        filter?.to,
        filter?.comment
      )
      .then(({data}) => ({data}));
  },
  getOne: notImplemented,
  async saveOrUpdate(payload: UpdateGrade, meta: ParticipantGradeParams = {}) {
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
  delete: notImplemented,
};

export default correctGradeProvider;
