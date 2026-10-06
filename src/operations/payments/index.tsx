import {AttachMoney} from "@mui/icons-material";
import CreditPaymentList from "./CreditPaymentList";
import FeePaymentListPage from "./FeePaymentListPage";
import PaymentCreate from "./PaymentCreate";

const payments = {
  list: FeePaymentListPage,
  listCreditPayments: CreditPaymentList,
  create: PaymentCreate,
  icon: AttachMoney,
  options: {label: "Paiements"},
};

export default payments;
