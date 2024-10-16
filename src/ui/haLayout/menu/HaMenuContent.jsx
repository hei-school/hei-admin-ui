import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "@/providers/authProvider";
import ManagerMenu from "./ManagerMenu";
import StudentMenu from "./StudentMenu";
import TeacherMenu from "./TeacherMenu";

export function HaMenuContent() {
  const role = authProvider.getCachedWhoami().role;

  if (role === WhoamiRoleEnum.STUDENT) {
    return <StudentMenu />;
  }
  if (role === WhoamiRoleEnum.MANAGER) {
    return <ManagerMenu />;
  }
  if (role === WhoamiRoleEnum.TEACHER) {
    return <TeacherMenu />;
  }
  return null;
}
