import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const teacherProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    const result = await usersApi().getTeachers(
      page,
      perPage,
      filter.ref,
      filter.first_name,
      filter.last_name,
      filter.status,
      filter.sex
    );
    return result.data;
  },
  async getOne(id: string) {
    const result = await usersApi().getTeacherById(id);
    return result.data;
  },
  async saveOrUpdate(users: Array<any>, meta: any) {
    if (meta?.isUpdate) {
      const [teacher] = users;
      const result = await usersApi().updateTeacher(teacher.id, teacher);
      return [result.data];
    }
    const result = await usersApi().createOrUpdateTeachers(users);
    return result.data;
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default teacherProvider;
