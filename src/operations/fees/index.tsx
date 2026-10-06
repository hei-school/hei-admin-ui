import {AttachMoney} from "@mui/icons-material";
import ByStatusFeeList from "./ByStatusFeeList";
import FeeCreate from "./FeeCreate";
import FeeEdit from "./FeeEdit";
import FeeList from "./FeeList";
import FeeShow from "./FeeShow";
import FeesToArchiveList from "./FeesToArchiveList";
import MultipleStudentFeesCreate from "./MultipleStudentFeesCreate";
import TransactionFeeList from "./TransactionFeeList";

const fees = {
  list: FeeList,
  listByStatus: ByStatusFeeList,
  listByTransactions: TransactionFeeList,
  listToArchive: FeesToArchiveList,
  show: FeeShow,
  singStudentFeesCreate: FeeCreate,
  multipleStudentFeesCreate: MultipleStudentFeesCreate,
  edit: FeeEdit,
  icon: AttachMoney,
  options: {label: "Frais"},
};

export default fees;
