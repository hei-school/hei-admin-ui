import authProvider from "@/providers/authProvider";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {FC} from "react";
import ProfileShow from "../profile/ProfileShow";
import {AdminWelcome} from "./components/AdminWelcome";

export const DashboardContent: FC = () => {
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
