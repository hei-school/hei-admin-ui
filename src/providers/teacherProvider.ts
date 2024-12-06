import {Teacher} from "@haapi/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const teacherProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return await usersApi()
      .getTeachers(
        page,
        perPage,
        filter.ref,
        filter.first_name,
        filter.last_name,
        filter.status,
        filter.sex
      )
      .then((result) => ({data: result.data}));
  },
  async getOne(id: string) {
    const result = await usersApi().getTeacherById(id);
    return result.data;
  },
  async saveOrUpdate(
    teachers: Required<Teacher>[],
    meta?: {isUpdate?: boolean}
  ) {
    if (meta?.isUpdate) {
      const [teacher] = teachers;
      const result = await usersApi().updateTeacher(teacher.id, teacher);
      return [result.data];
    }
    const result = await usersApi().createOrUpdateTeachers(teachers);
    return result.data;
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default teacherProvider;
