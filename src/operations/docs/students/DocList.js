import {useParams, useLocation} from "react-router-dom";
import {useStudentRef} from "../../../hooks";
import {useRole} from "../../../security/hooks";
import {DocList as CommonDocList} from "../components/DocList";
import {useViewType} from "../hooks/useViewType";
import authProvider from "../../../providers/authProvider";

export const DocList = () => {
  const params = useParams();
  const location = useLocation();

  const type = useViewType("LIST");
  const {isStudent, isManager} = useRole();

  const getStudentRef = useStudentRef("studentId");

  let studentRef = "";

  if (isManager()) {
    studentRef = getStudentRef.studentRef;
  }

  const studentId = isStudent()
    ? authProvider.getCachedWhoami().id
    : params.studentId;

  return (
    <CommonDocList
      owner="STUDENT"
      type={type}
      studentId={studentId}
      studentRef={isManager() && studentRef}
      datagridProps={{
        rowClick: (id) => `${isManager() ? location.pathname : ""}/${id}`,
      }}
    />
  );
};
