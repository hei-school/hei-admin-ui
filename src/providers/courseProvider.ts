import {Course} from "@haapi/typescript-client";
import {HaDataProviderType} from "./HaDataProviderType";
import {teachingApi} from "./api";

const courseProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return teachingApi()
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
  async getOne(id: string) {
    return teachingApi()
      .getCourseById(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(payload: Course[]) {
    return teachingApi()
      .createOrUpdateCourses(payload)
      .then((response) => response.data);
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default courseProvider;
