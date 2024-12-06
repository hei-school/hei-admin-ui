import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {useParams} from "react-router-dom";
import {DocShow} from "../components/DocShow";

export const StaffDocShow = () => {
  const params = useParams();
  const {isStaffMember} = useRole();
  const id = isStaffMember()
    ? authProvider.getCachedWhoami().id
    : params.userId;

  return <DocShow owner="STAFF_MEMBER" userId={id} />;
};
