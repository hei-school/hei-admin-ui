import {studentIdFromRaId} from "@/providers/feeProvider";
import {useParams} from "react-router-dom";
import PaymentList from "./PaymentList";

// Route `/fees/:feeId/payments` : l'id du frais vient de l'URL et contient
// celui de l'étudiant, comme dans FeeShow.
const FeePaymentListPage = () => {
  const {feeId = ""} = useParams<{feeId: string}>();

  return <PaymentList feeId={feeId} studentId={studentIdFromRaId(feeId)} />;
};

export default FeePaymentListPage;
