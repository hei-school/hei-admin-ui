import {DocShow as CommonDocShow} from "../components/DocShow";
import {useParams} from "react-router-dom";
import {useRole} from "../../../security/hooks/useRole";
import authProvider from "../../../providers/authProvider";

export const DocShow = () => {
  const params = useParams();
  const {isStudent} = useRole();

  const id = isStudent() ? authProvider.getCachedWhoami().id : params.studentId;

  return <CommonDocShow owner="STUDENT" studentId={id} />;
};
