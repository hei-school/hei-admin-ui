import {useParams} from "react-router-dom";
import authProvider from "../../../providers/authProvider";
import {useRole} from "../../../security/hooks/useRole";
import {DocShow as CommonDocShow} from "../components/DocShow";
import {OwnerType} from "../types";

export const DocShow = () => {
  const params = useParams();
  const {isStudent} = useRole();

  const id = isStudent() ? authProvider.getCachedWhoami().id : params.userId;

  return <CommonDocShow owner={OwnerType.STUDENT} userId={id} />;
};
