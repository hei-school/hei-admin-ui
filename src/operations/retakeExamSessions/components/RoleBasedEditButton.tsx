import {useRole} from "@/security/hooks";
import {EditButton, useRecordContext} from "react-admin";

export const RoleBasedEditButton = () => {
  const record = useRecordContext();
  const {isAdmin, isManager} = useRole();
  if (!record) return null;
  if (isAdmin() || isManager()) {
    return <EditButton record={record} />;
  }

  return null;
};
