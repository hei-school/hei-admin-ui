import {AttachMoney} from "@mui/icons-material";
import CreditPaymentList from "./CreditPaymentList";
import PaymentCreate from "./PaymentCreate";
import PaymentList from "./PaymentList";

const payments = {
  list: PaymentList,
  listCreditPayments: CreditPaymentList,
  create: PaymentCreate,
  icon: AttachMoney,
  options: {label: "Paiements"},
};

export default payments;
