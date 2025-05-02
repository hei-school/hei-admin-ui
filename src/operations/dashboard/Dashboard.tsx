import authProvider from "@/providers/authProvider";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {FC} from "react";
import {AdminWelcome} from "./components/AdminWelcome";

export const DashboardContent: FC = () => {
  const role = authProvider.getCachedWhoami().role;

  switch (role) {
    case WhoamiRoleEnum.ADMIN:
    case WhoamiRoleEnum.MANAGER:
      return <AdminWelcome />;
    default:
      return null;
  }
};
