import {useStudentRef} from "@/operations/fees/hooks/useStudentRef";
import {CreditTransactionList} from "./CreditTransactionList";

export const StudentCreditTransactions = () => {
  const {studentId} = useStudentRef("studentId");
  return <CreditTransactionList studentId={String(studentId ?? "")} />;
};
