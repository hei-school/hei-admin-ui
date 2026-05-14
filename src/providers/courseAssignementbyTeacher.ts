import {coursesApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

export const courseAssignmentsByTeacherProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
    const {teacherId} = filter;
    return coursesApi().getCourseAssignmentByTeacherId(
      teacherId,
      page,
      perPage
    );
  },
  getOne: () => {
    throw new Error("Not implemented");
  },
  saveOrUpdate: () => {
    throw new Error("Not implemented");
  },
  delete: () => {
    throw new Error("Not implemented");
  },
};
