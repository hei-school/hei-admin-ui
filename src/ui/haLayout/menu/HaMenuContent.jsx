import authProvider from "@/providers/authProvider";
import {useFeesOnly} from "@/security/hooks";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import AdminMenu from "./AdminMenu";
import ManagerMenu from "./ManagerMenu";
import ManagerMenuFeesOnly from "./ManagerMenuFeesOnly";
import MonitorMenu from "./MonitorMenu";
import {OrganizerMenu} from "./OrganizerMenu";
import StaffMenu from "./StaffMenu";
import StudentMenu from "./StudentMenu";
import StudentMenuFeesOnly from "./StudentMenuFeesOnly";
import TeacherMenu from "./TeacherMenu";

export function HaMenuContent() {
  const role = authProvider.getCachedWhoami().role;
  const feesOnly = useFeesOnly();

  if (feesOnly) {
    switch (role) {
      case WhoamiRoleEnum.ADMIN:
      case WhoamiRoleEnum.MANAGER:
        return <ManagerMenuFeesOnly />;
      case WhoamiRoleEnum.STUDENT:
        return <StudentMenuFeesOnly />;
      default:
        return null;
    }
  }

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