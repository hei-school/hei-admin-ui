import {
  CrupdateTeacher,
  EnableStatus,
  Sex,
  Teacher,
} from "@haapi-b0fc7615/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType, HaMeta, notImplemented} from "./HaDataProviderType";

interface TeacherFilter {
  ref?: string;
  first_name?: string;
  last_name?: string;
  status?: EnableStatus;
  sex?: Sex;
}

const teacherProvider: HaDataProviderType<
  Teacher,
  TeacherFilter,
  HaMeta,
  CrupdateTeacher[]
> = {
  getList: async (page: number, perPage: number, filter: TeacherFilter) => {
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
    teachers: CrupdateTeacher[],
    meta?: {isUpdate?: boolean}
  ) => {
    if (meta?.isUpdate) {
      const [teacher] = teachers;
      const result = await usersApi().updateTeacher(teacher.id!, teacher);
      return [result.data];
    }
    return usersApi()
      .createOrUpdateTeachers(teachers)
      .then((result) => result.data);
  },
  delete: notImplemented,
};

export default teacherProvider;
