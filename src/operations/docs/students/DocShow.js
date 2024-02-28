import {useRole} from "../../../security/hooks/useRole";
import authProvider from "../../../providers/authProvider";

const StudentViewDocShow = () => {
  const id = authProvider.getCachedWhoami().id;
  return <DocShow owner="STUDENT" studentId={id} />;
};

// TODO: add this later for manager view
const ManagerViewDocShow = () => {
  return <></>;
};

export const DocShow = () => {
  const {isStudent} = useRole();

  return isStudent ? <StudentViewDocShow /> : <ManagerViewDocShow />;
};
