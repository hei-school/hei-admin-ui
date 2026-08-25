import {EnableStatus, Sex, Teacher} from "@haapi-3d601c85/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const teacherProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {
      ref?: string;
      first_name?: string;
      last_name?: string;
      status?: EnableStatus;
      sex?: Sex;
    }
  ) => {
    return usersApi()
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
  getOne: async (id: string) => {
    return usersApi()
      .getTeacherById(id)
      .then((result) => result.data);
  },
  saveOrUpdate: async (
    teachers: Required<Teacher>[],
    meta?: {isUpdate?: boolean}
  ) => {
    if (meta?.isUpdate) {
      const [teacher] = teachers;
      const result = await usersApi().updateTeacher(teacher.id, teacher);
      return [result.data];
    }
    return usersApi()
      .createOrUpdateTeachers(teachers)
      .then((result) => result.data);
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default teacherProvider;
