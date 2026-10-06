import {useRole} from "@/security/hooks/useRole";
import {ManagerFeeList, StudentFeeList} from "./components";

interface FeeListProps {
  studentId: string;
  studentRef: string;
}

const FeeList = ({studentId, studentRef}: Readonly<FeeListProps>) => {
  const {isStudent} = useRole();
  return isStudent() ? (
    <StudentFeeList />
  ) : (
    <ManagerFeeList studentId={studentId} studentRef={studentRef} />
  );
};

export default FeeList;
