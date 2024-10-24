import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "@/providers/authProvider";
import ManagerMenu from "./ManagerMenu";
import StudentMenu from "./StudentMenu";
import TeacherMenu from "./TeacherMenu";
import MonitorMenu from "./MonitorMenu";

export function HaMenuContent() {
  const role = authProvider.getCachedWhoami().role;

  switch (role) {
    case WhoamiRoleEnum.STUDENT:
      return <StudentMenu />;
    case WhoamiRoleEnum.MANAGER:
      return <ManagerMenu />;
    case WhoamiRoleEnum.TEACHER:
      return <TeacherMenu />;
    case WhoamiRoleEnum.MONITOR:
      return <MonitorMenu />;
    default:
      return null;
  }
}
