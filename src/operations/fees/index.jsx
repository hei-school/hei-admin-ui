import {AttachMoney} from "@mui/icons-material";
import FeeList from "./FeeList";
import ByStatusFeeList from "./ByStatusFeeList";
import FeeShow from "./FeeShow";
import FeeCreate from "./FeeCreate";
import FeeEdit from "./FeeEdit";
import TransactionFeeList from "./TransactionFeeList";
import MultipleStudentFeesCreate from "./MultipleStudentFeesCreate";

const fees = {
  list: FeeList,
  listByStatus: ByStatusFeeList,
  listByTransactions: TransactionFeeList,
  show: FeeShow,
  singStudentFeesCreate: FeeCreate,
  multipleStudentFeesCreate: MultipleStudentFeesCreate,
  edit: FeeEdit,
  icon: AttachMoney,
  options: {label: "Frais"},
};

export default fees;
