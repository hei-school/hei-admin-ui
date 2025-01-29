import {AttachMoney} from "@mui/icons-material";
import PaymentCreate from "./PaymentCreate";
import PaymentList from "./PaymentList";

const payments = {
  list: PaymentList,
  create: PaymentCreate,
  icon: AttachMoney,
  options: {label: "Paiements"},
};

export default payments;
