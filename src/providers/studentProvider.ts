import {EnableStatus} from "@haapi-b0fc7615/typescript-client";
import {payingApi, usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const studentProvider: HaDataProviderType = {
  getList: async (page: number, perPage: number, filter: any) => {
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
    payload: any,
    Params = {isUpdate: true, dueDatetime: Date}
  ) => {
    if (Params.isUpdate) {
      const [student] = payload;
      const result = await usersApi().updateStudent(student.id, student);
      return [result.data];
    }
    let [fees, students] = payload[0];

    students = students.map((student: any) => ({
      ...student,
      status: EnableStatus.ENABLED,
    }));
    const studentResponse = (
      await usersApi().createOrUpdateStudents(
        students,
        Params.meta?.dueDatetime
      )
    ).data;

    if (students.length <= 1 && fees.length > 0) {
      await payingApi().createStudentFees(studentResponse[0]?.id!, fees);
    }
    return studentResponse;
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default studentProvider;
