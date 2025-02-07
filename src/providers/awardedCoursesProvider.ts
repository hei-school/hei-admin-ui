import {teachingApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {CreateAwardedCourse} from "@haapi/typescript-client";

const awardedCoursesProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}, _meta) => {
    const {teacherId, courseId, groupId} = filter;

    return teachingApi()
      .getAllAwardedCourseByCriteria(
        teacherId,
        groupId,
        courseId,
        page,
        perPage
      )
      .then((result) => ({data: result.data}));
  },
  async getOne(id: string) {
    return teachingApi()
      .getAwardedCoursesAssignedToTeacher(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(payload: CreateAwardedCourse[]) {
    const {main_teacher_id} = payload[0];
    if (!main_teacher_id) {
      throw new Error("Teacher ID is required");
    }
    return teachingApi()
      .createOrUpdateAwardedCoursesAssignToTeacher(main_teacher_id, payload)
      .then((response) => {
        return response.data;
      });
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default awardedCoursesProvider;
