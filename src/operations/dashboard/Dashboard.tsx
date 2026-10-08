import authProvider from "@/providers/authProvider";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import ProfileShow from "../profile/ProfileShow";
import {AdminWelcome} from "./components/AdminWelcome";

export const DashboardContent = () => {
  const role = authProvider.getCachedWhoami().role;

  switch (role) {
    case WhoamiRoleEnum.ADMIN:
    case WhoamiRoleEnum.MANAGER:
      return <AdminWelcome />;
    case WhoamiRoleEnum.MONITOR:
    case WhoamiRoleEnum.ORGANIZER:
    case WhoamiRoleEnum.STAFF_MEMBER:
    case WhoamiRoleEnum.STUDENT:
    case WhoamiRoleEnum.TEACHER:
      return <ProfileShow />;
    default:
      return null;
  }
};
