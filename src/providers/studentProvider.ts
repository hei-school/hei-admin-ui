/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  CreateFee,
  CrupdateStudent,
  EnableStatus,
  Sex,
  Student,
  StudentLevel,
  WorkStudyStatus,
} from "@haapi-b0fc7615/typescript-client";
import {payingApi, usersApi} from "./api";
import {HaDataProviderType, HaSaveParams} from "./HaDataProviderType";

interface StudentFilter {
  ref: string;
  first_name: string;
  last_name: string;
  course_id: string;
  status: EnableStatus;
  sex: Sex;
  work_study_status: WorkStudyStatus;
  commitment_begin_date: Date;
  exclude_groups: string[];
}

type StudentRecord = Student & {level?: StudentLevel};

type StudentUpdate = CrupdateStudent & {id: string};

// à la création, les frais à créer et les étudiants
type StudentCreation = [CreateFee[], Student[]];

type StudentPayload = StudentUpdate[] | [StudentCreation];

type StudentSaveParams = HaSaveParams<{dueDatetime?: Date}>;

// seul isUpdate indique la forme du payload : une mise à jour ou une création
const isStudentUpdate = (
  _payload: StudentPayload,
  isUpdate?: boolean
): _payload is StudentUpdate[] => Boolean(isUpdate);

const studentProvider: HaDataProviderType<
  StudentRecord,
  StudentFilter,
  {dueDatetime?: Date},
  StudentPayload,
  StudentSaveParams,
  Student[]
> = {
  getList: async (page: number, perPage: number, filter: StudentFilter) => {
    return usersApi()
      .getStudents(
        page,
        perPage,
        filter.ref,
        filter.first_name,
        filter.last_name,
        filter.course_id,
        filter.status,
        filter.sex,
        filter.work_study_status,
        filter.commitment_begin_date,
        filter.exclude_groups
      )
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    const [studentResult, levelResult] = await Promise.all([
      usersApi().getStudentById(id),
      usersApi().getStudentLevel(id),
    ]);
    return {
      ...studentResult.data,
      level: levelResult.data,
    };
  },
  saveOrUpdate: async (
    payload,
    Params: StudentSaveParams = {isUpdate: true}
  ) => {
    if (isStudentUpdate(payload, Params.isUpdate)) {
      const [student] = payload;
      const result = await usersApi().updateStudent(student.id, student);
      return [result.data];
    }

    const [fees, students] = payload[0];
    const formattedStudents = students.map((student: Student) => ({
      ...student,
      status: EnableStatus.ENABLED,
    }));
    const studentResponse = (
      await usersApi().createOrUpdateStudents(
        formattedStudents,
        Params.meta?.dueDatetime
      )
    ).data;

    if (formattedStudents.length <= 1 && fees.length > 0) {
      await payingApi().createStudentFees(studentResponse[0]?.id!, fees);
    }
    return studentResponse;
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default studentProvider;
