import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {useLocation, useParams} from "react-router-dom";
import {DocList, DocListAction} from "../components/DocList";

export const TeacherDocList = () => {
  const params = useParams();
  const location = useLocation();
  const {isTeacher, isAdmin} = useRole();
  const userId = isTeacher()
    ? authProvider.getCachedWhoami().id
    : params.userId;

  return (
    <DocList
      type="OTHER"
      owner="TEACHER"
      userId={userId!}
      title={`Liste des documents des enseignants`}
      haListProps={{
        actions: isAdmin() ? (
          <DocListAction userId={userId!} owner="TEACHER" type="OTHER" />
        ) : null,
      }}
      datagridProps={{
        rowClick: (id) => `${location.pathname}/${id}`,
      }}
    />
  );
};
