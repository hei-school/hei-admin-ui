import {useParams} from "react-router-dom";
import authProvider from "../../../providers/authProvider";
import {useRole} from "../../../security/hooks/useRole";
import {DocShow} from "../components/DocShow";
import {OwnerType} from "../types";

export const TeacherDocShow = () => {
  const params = useParams();
  const {isTeacher} = useRole();

  const id = isTeacher() ? authProvider.getCachedWhoami().id : params.userId;

  if (!id) return null;
  return <DocShow owner={OwnerType.TEACHER} userId={id} />;
};
