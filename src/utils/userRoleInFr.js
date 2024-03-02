import {WhoamiRoleEnum} from "@haapi/typescript-client";

export function getUserRoleInFr(userRole) {
  switch (userRole) {
    case WhoamiRoleEnum.MANAGER:
      return "Admin";
    case WhoamiRoleEnum.TEACHER:
      return "Enseignant(e)";
    case WhoamiRoleEnum.STUDENT:
      return "Étudiant(e)";
    default:
      throw new Error("Unknown user role");
  }
}
