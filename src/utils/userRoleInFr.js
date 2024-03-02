import { WhoamiRoleEnum } from "@haapi/typescript-client";

const UserRoleInFr = {
  MANAGER: "Admin",
  TEACHER: "Enseignant(e)",
  STUDENT: "Étudiant(e)",
};

export function getUserRoleInFr(userRole) {
  switch (userRole) {
    case WhoamiRoleEnum.MANAGER:
      return UserRoleInFr.MANAGER;
    case WhoamiRoleEnum.TEACHER:
      return UserRoleInFr.TEACHER;
    case WhoamiRoleEnum.STUDENT:
      return UserRoleInFr.STUDENT;
    default:
      throw new Error("Unknown user role");
  }
}
