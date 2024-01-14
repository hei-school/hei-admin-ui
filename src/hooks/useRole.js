import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "../providers/authProvider";

export function useRole() {
  const auth = authProvider.getCachedWhoami();
  return {
    isStudent: auth.role === WhoamiRoleEnum.STUDENT,
    isManager: auth.role === WhoamiRoleEnum.MANAGER,
    isTeacher: auth.role === WhoamiRoleEnum.TEACHER,
    ...auth,
  };
}
