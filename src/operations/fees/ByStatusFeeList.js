import {FunctionField, ShowButton, useListContext} from "react-admin";
import {FeeStatusEnum} from "@haapi/typescript-client";
import {AttachMoney} from "@mui/icons-material";
import {commentFunctionRenderer} from "../utils";
import {HaList} from "../../ui/haList/HaList";
import {FeesFilter} from ".";
import {rowStyle} from "./utils/commonStyle";
import {DateField} from "../common/components/fields";
import {renderPrettyMoney} from "../common/utils/money"

const FEES_STATUS_VALUE = {
  LATE: "en retard",
  PAID: "payés",
  UNPAID: "en attente",
};

const ListTitle = () => {
  const {filterValues} = useListContext();
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
    <DateField source="due_datetime" label="Date limite" showTime={false} />
    <FunctionField
      source="comment"
      render={commentFunctionRenderer}
      label="Commentaire"
    />
    <FunctionField
      label="Reste à payer"
      render={(fee) => renderPrettyMoney(fee.remaining_amount)}
      textAlign="right"
    />
    <DateField
      source="creation_datetime"
      label="Date de création"
      showTime={false}
    />
    <ShowButton basePath="/fees" />
  </HaList>
);

export default ByStatusFeeList;
