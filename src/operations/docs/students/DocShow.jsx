import {useParams} from "react-router-dom";
import {DocShow as CommonDocShow} from "../components/DocShow";
import {useRole} from "../../../security/hooks/useRole";
import {OwnerType} from "../types";
import authProvider from "../../../providers/authProvider";

export const DocShow = () => {
  const params = useParams();
  const {isStudent} = useRole();

  const id = isStudent() ? authProvider.getCachedWhoami().id : params.userId;

  return <CommonDocShow owner={OwnerType.STUDENT} userId={id} />;
};
