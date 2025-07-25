import {coursesApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {CrupdateCourseAssignment} from "@haapi/typescript-client";

const CourseAssignmentsProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}, _meta) => {
    const {teacherId, courseId, groupId} = filter;

    return coursesApi()
      .getCourseAssignmentsByCriteria(
        teacherId,
        groupId,
        courseId,
        page,
        perPage
      )
      .then((result) => ({data: result.data}));
  },
  async getOne(id: string) {
    return coursesApi()
      .getCourseAssignmentByTeacherId(id)
      .then((response) => response.data);
  },
  async saveOrUpdate(payload: CrupdateCourseAssignment[]) {
    const {main_teacher_id} = payload[0];
    if (!main_teacher_id) {
      throw new Error("Teacher ID is required");
    }
    return coursesApi()
      .createOrUpdateCourseAssignments(payload)
      .then((response) => {
        return response.data;
      });
  },
  async delete(_id: string) {
    throw new Error("Not implemented");
  },
};

export default CourseAssignmentsProvider;
