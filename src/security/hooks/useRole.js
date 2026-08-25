import authProvider from "@/providers/authProvider";
import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";

export function useRole() {
  const {role} = authProvider.getCachedWhoami();
  return {
    isStudent: () => role === WhoamiRoleEnum.STUDENT,
    isManager: () => role === WhoamiRoleEnum.MANAGER,
    isTeacher: () => role === WhoamiRoleEnum.TEACHER,
    isMonitor: () => role === WhoamiRoleEnum.MONITOR,
    isAdmin: () => role === WhoamiRoleEnum.ADMIN,
    isStaffMember: () => role === WhoamiRoleEnum.STAFF_MEMBER,
    isOrganizer: () => role === WhoamiRoleEnum.ORGANIZER,
    role,
  };
}
