import {useRole} from "@/security/hooks/useRole";
import {ManagerFeeList, StudentFeeList} from "./components";

export const MPBS_STATUS_LABEL = {
  SUCCESS: "Paiement avec succès",
  FAILED: "Paiement échoué",
  PENDING: "Vérification en cours",
};

const FeeList = ({studentId, studentRef}) => {
  const {isStudent} = useRole();
  return isStudent() ? (
    <StudentFeeList studentId={studentId} studentRef={studentRef} />
  ) : (
    <ManagerFeeList studentId={studentId} studentRef={studentRef} />
  );
};

export default FeeList;
