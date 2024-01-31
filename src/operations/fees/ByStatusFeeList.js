import {FunctionField, ShowButton, useListContext} from "react-admin";
import {rowStyle} from "./utils";
import {AttachMoney} from "@mui/icons-material";
import {
  prettyPrintMoney,
  CustomDateField,
  commentFunctionRenderer,
} from "../utils";
import {HaList} from "../../ui/haList/HaList";
import {FeesFilter} from ".";
import {FeeStatusEnum} from "@haapi/typescript-client";

const FEES_STATUS_VALUE = {
  LATE: "en retard",
  PAID: "payés",
  UNPAID: "non payés",
};

const ListTitle = () => {
  const {filterValues, filter} = useListContext();
  return (
    <p>
      Liste de tous les frais {FEES_STATUS_VALUE[filterValues.status ?? "LATE"]}
    </p>
  );
};

const ByStatusFeeList = (props) => (
  <HaList
    {...props}
    icon={<AttachMoney />}
    title={<ListTitle />}
    resource="fees"
    listProps={{
      filterDefaultValues: {status: FeeStatusEnum.LATE},
    }}
    filterIndicator={false}
    datagridProps={{
      rowClick: (id) => `/fees/${id}/show`,
      rowStyle,
    }}
    actions={<FeesFilter />}
  >
    <CustomDateField
      source="due_datetime"
      label="Date limite"
      showTime={false}
    />
    <FunctionField
      source="comment"
      render={commentFunctionRenderer}
      label="Commentaire"
    />
    <FunctionField
      label="Reste à payer"
      render={(fee) => prettyPrintMoney(fee.remaining_amount)}
      textAlign="right"
    />
    <CustomDateField
      source="creation_datetime"
      label="Date de création"
      showTime={false}
    />
    <ShowButton basePath="/fees" />
  </HaList>
);

export default ByStatusFeeList;
