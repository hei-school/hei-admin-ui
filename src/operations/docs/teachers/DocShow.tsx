import {useParams} from "react-router-dom";
import {DocShow} from "../components/DocShow";
import {useRole} from "../../../security/hooks/useRole";
import {OwnerType} from "../types";
import authProvider from "../../../providers/authProvider";

export const TeacherDocShow = () => {
  const params = useParams();
  const {isTeacher} = useRole();

  const id = isTeacher() ? authProvider.getCachedWhoami().id : params.userId;

  return <DocShow owner={OwnerType.TEACHER} userId={id} />;
};
