import {useRole} from "@/security/hooks";
import {ShowButton, useRecordContext} from "react-admin";

export const RoleBasedShowButton = () => {
  const parents = useRecordContext();
  const {isAdmin, isManager} = useRole();
  if (!parents) return null;
  if (isAdmin() || isManager()) {
    return <ShowButton record={parents} />;
  }
  return <ShowButton resource="retakeExams" record={parents} />;
};
