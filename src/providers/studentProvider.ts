import {EnableStatus} from "@haapi/typescript-client";
import {payingApi, usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const studentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
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
  async getOne(id: string) {
    const result = await usersApi().getStudentById(id);
    return result.data;
  },
  async saveOrUpdate(
    payload: any,
    Params = {isUpdate: true, dueDatetime: Date}
  ) {
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
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default studentProvider;
