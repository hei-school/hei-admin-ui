import authProvider from "../../../providers/authProvider";
import {useRole} from "../../../security/hooks";
import {DocList as CommonDocList} from "../components/DocList";
import {useViewType} from "../hooks/useViewType";

export const DocList = () => {
  const {isStudent} = useRole();
  const type = useViewType("LIST");

  // TODO: add manager view for list
  const studentId = isStudent() ? authProvider.getCachedWhoami().id : "";

  return (
    <CommonDocList
      owner="STUDENT"
      type={type}
      studentId={studentId}
      datagridProps={{
        rowClick: (id) => `/docs/students/${type}/${id}`,
      }}
    />
  );
};
