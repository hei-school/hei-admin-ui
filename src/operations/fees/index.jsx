import {AttachMoney} from "@mui/icons-material";
import FeeList from "./FeeList";
import ByStatusFeeList from "./ByStatusFeeList";
import FeeShow from "./FeeShow";
import FeeCreate from "./FeeCreate";
import FeeEdit from "./FeeEdit";
import {FilterForm, SelectInputFilter} from "../../ui/haToolbar";
import {FeeStatusEnum} from "@haapi/typescript-client";

const fees = {
  list: FeeList,
  listByStatus: ByStatusFeeList,
  show: FeeShow,
  create: FeeCreate,
  edit: FeeEdit,
  icon: AttachMoney,
  options: {label: "Frais"},
};

export const FeesFilter = () => (
  <FilterForm>
    <SelectInputFilter
      data-testid="filter-fees-status"
      label="Statut"
      source="status"
      choices={[
        {id: FeeStatusEnum.LATE, name: "En retard"},
        {id: FeeStatusEnum.PAID, name: "Payés"},
        {id: FeeStatusEnum.UNPAID, name: "En attente"},
      ]}
    />
  </FilterForm>
);

export default fees;
