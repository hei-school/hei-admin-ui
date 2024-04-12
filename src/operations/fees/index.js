import {AttachMoney} from "@mui/icons-material";
import FeeList from "./FeeList";
import ByStatusFeeList from "./ByStatusFeeList";
import FeeShow from "./FeeShow";
import FeeCreate from "./FeeCreate";
import FeeEdit from "./FeeEdit";

const fees = {
  list: FeeList,
  listByStatus: ByStatusFeeList,
  show: FeeShow,
  create: FeeCreate,
  edit: FeeEdit,
  icon: AttachMoney,
  options: {label: "Frais"},
};

export default fees;
