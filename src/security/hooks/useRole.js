import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "@/providers/authProvider";

export function useRole() {
  const {role} = authProvider.getCachedWhoami();
  return {
    isStudent: () => role === WhoamiRoleEnum.STUDENT,
    isManager: () => role === WhoamiRoleEnum.MANAGER,
    isTeacher: () => role === WhoamiRoleEnum.TEACHER,
    isMonitor: () => role === WhoamiRoleEnum.MONITOR,
    isAdmin: () => role === WhoamiRoleEnum.ADMIN,
    isStaffMember: () => role === WhoamiRoleEnum.STAFF_MEMBER,
    role,
  };
}
