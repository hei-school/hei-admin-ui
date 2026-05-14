import {coursesApi} from "@/providers/api";
import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {CrupdateCourseAssignment} from "@haapi-b0fc7615/typescript-client";

const CourseAssignmentsProvider: HaDataProviderType = {
  getList: async (page, perPage, filter = {}) => {
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
  getOne: async (id: string) => {
    return coursesApi()
      .getCourseAssignmentByTeacherId(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async (payload: CrupdateCourseAssignment[]) => {
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
  delete: () => {
    throw new Error("Not implemented");
  },
};

export default CourseAssignmentsProvider;
