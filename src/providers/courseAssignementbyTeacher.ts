import {CourseAssignment} from "@haapi-b0fc7615/typescript-client";
import {coursesApi} from "./api";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";

interface CourseAssignmentByTeacherFilter {
  teacherId?: string;
}

export const courseAssignmentsByTeacherProvider: HaDataProviderType<
  CourseAssignment,
  CourseAssignmentByTeacherFilter
> = {
  getList: async (page, perPage, filter = {}) => {
    const {teacherId} = filter;
    return coursesApi().getCourseAssignmentByTeacherId(
      teacherId!,
      page,
      perPage
    );
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};
