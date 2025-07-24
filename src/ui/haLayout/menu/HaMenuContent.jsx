import authProvider from "@/providers/authProvider";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import AdminMenu from "./AdminMenu";
import ManagerMenu from "./ManagerMenu";
import MonitorMenu from "./MonitorMenu";
import {OrganizerMenu} from "./OrganizerMenu";
import StaffMenu from "./StaffMenu";
import StudentMenu from "./StudentMenu";
import TeacherMenu from "./TeacherMenu";

export function HaMenuContent() {
  const role = authProvider.getCachedWhoami().role;

  switch (role) {
    case WhoamiRoleEnum.STUDENT:
      return <StudentMenu />;
    case WhoamiRoleEnum.ADMIN:
      return <AdminMenu />;
    case WhoamiRoleEnum.MANAGER:
      return <ManagerMenu />;
    case WhoamiRoleEnum.TEACHER:
      return <TeacherMenu />;
    case WhoamiRoleEnum.STAFF_MEMBER:
      return <StaffMenu />;
    case WhoamiRoleEnum.MONITOR:
      return <MonitorMenu />;
    case WhoamiRoleEnum.ORGANIZER:
      return <OrganizerMenu />;
    default:
      return null;
  }
}
