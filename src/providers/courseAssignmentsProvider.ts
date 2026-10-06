import {coursesApi} from "@/providers/api";
import {
  HaDataProviderType,
  HaMeta,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {
  CourseAssignment,
  CrupdateCourseAssignment,
} from "@haapi-b0fc7615/typescript-client";

interface CourseAssignmentFilter {
  teacherId?: string;
  courseId?: string;
  groupId?: string;
}

// getOne renvoie toutes les affectations du professeur dont l'id est donné
const CourseAssignmentsProvider: HaDataProviderType<
  CourseAssignment | CourseAssignment[],
  CourseAssignmentFilter,
  HaMeta,
  CrupdateCourseAssignment[],
  unknown,
  CourseAssignment[]
> = {
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
  delete: notImplemented,
};

export default CourseAssignmentsProvider;
