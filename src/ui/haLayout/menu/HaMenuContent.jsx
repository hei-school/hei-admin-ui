import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "@/providers/authProvider";
import ManagerMenu from "./ManagerMenu";
import StudentMenu from "./StudentMenu";
import TeacherMenu from "./TeacherMenu";
import MonitorMenu from "./MonitorMenu";
import AdminMenu from "./AdminMenu";

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
    case WhoamiRoleEnum.ADMIN:
      return <AdminMenu />;
    default:
      return null;
  }
}
