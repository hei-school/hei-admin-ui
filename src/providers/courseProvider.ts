import {Course, CourseDirection} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType, notImplemented} from "./HaDataProviderType";
import {coursesApi} from "./api";

interface CourseFilter {
  code?: string;
  name?: string;
  credits?: number;
  teacherFirstName?: string;
  teacherLastName?: string;
  creditsOrder?: CourseDirection;
  codeOrder?: CourseDirection;
}

const courseProvider: HaDataProviderType<Course, CourseFilter> = {
  getList: async (page: number, perPage: number, filter: CourseFilter) => {
    return coursesApi()
      .getCourses(
        filter.code,
        filter.name,
        filter.credits,
        filter.teacherFirstName,
        filter.teacherLastName,
        filter.creditsOrder,
        filter.codeOrder,
        page,
        perPage
      )
      .then((result) => ({data: result.data}));
  },
  getOne: async (id: string) => {
    return coursesApi()
      .getCourseById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payload: Course[]) => {
    return coursesApi()
      .createOrUpdateCourses(payload)
      .then((response) => response.data);
  },
  delete: notImplemented,
};

export default courseProvider;
