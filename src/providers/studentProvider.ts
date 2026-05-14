/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  EnableStatus,
  Sex,
  Student,
  WorkStudyStatus,
} from "@haapi-b0fc7615/typescript-client";
import {payingApi, usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const studentProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {
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
  ) => {
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
    Params = {isUpdate: true, dueDatetime: Date}
  ) => {
    if (Params.isUpdate) {
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
