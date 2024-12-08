import {useRole} from "@/security/hooks/useRole";
import {ManagerFeeList, StudentFeeList} from "./components";

const FeeList = ({studentId, studentRef}) => {
  const {isStudent} = useRole();
  return isStudent() ? (
    <StudentFeeList studentId={studentId} studentRef={studentRef} />
  ) : (
    <ManagerFeeList studentId={studentId} studentRef={studentRef} />
  );
};

export default FeeList;
