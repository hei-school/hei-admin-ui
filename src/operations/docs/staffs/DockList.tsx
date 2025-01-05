import {useParams, useLocation} from "react-router-dom";
import {useRole} from "@/security/hooks";
import {DocList, DocListAction} from "../components/DocList";
import authProvider from "@/providers/authProvider";

export const StaffDocList = () => {
  const params = useParams();
  const location = useLocation();
  const {isStaffMember, isAdmin} = useRole();
  const userId = isStaffMember()
    ? authProvider.getCachedWhoami().id
    : params.userId;
  return (
    <DocList
      type="OTHER"
      owner="STAFF_MEMBER"
      userId={userId!}
      haListProps={{
        actions: isAdmin() ? (
          <DocListAction userId={userId!} owner="STAFF_MEMBER" type="OTHER" />
        ) : null,
      }}
      title="Liste des documents des membres de staff"
      datagridProps={{
        rowClick: (id) => `${location.pathname}/${id}`,
      }}
    />
  );
};
