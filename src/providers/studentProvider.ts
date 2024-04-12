import {usersApi, payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";
import {EnableStatus} from "@haapi/typescript-client";

const studentProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getStudents(
      page,
      perPage,
      filter.ref,
      filter.first_name,
      filter.last_name,
      filter.course_id,
      filter.status,
      filter.sex,
      filter.work_study_status
    );
    return result.data;
  },
  async getOne(id: string) {
    const result = await usersApi().getStudentById(id);
    return result.data;
  },
  async saveOrUpdate(payload: any, meta: any) {
    if (meta?.isUpdate) {
      const [student] = payload;
      const result = await usersApi().updateStudent(student.id, student);
      return [result.data];
    }
    let [fees, students] = payload[0];

    students = students.map((student: any) => ({
      ...student,
      status: EnableStatus.ENABLED,
    }));
    const studentResponse = (await usersApi().createOrUpdateStudents(students))
      .data;

    if (students.length <= 1 && fees.length > 0) {
      await payingApi().createStudentFees(studentResponse[0]?.id!, fees);
    }
    return studentResponse;
  },
  async delete(id: string) {
    throw new Error("Not implemented");
  },
};

export default studentProvider;
