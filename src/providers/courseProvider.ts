import {Course, CourseDirection} from "@haapi-b0fc7615/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {coursesApi} from "./api";

const courseProvider: HaDataProviderType = {
  getList: async (
    page: number,
    perPage: number,
    filter: {
      code?: string;
      name?: string;
      credits?: number;
      teacherFirstName?: string;
      teacherLastName?: string;
      creditsOrder?: CourseDirection;
      codeOrder?: CourseDirection;
    }
  ) => {
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
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default courseProvider;
