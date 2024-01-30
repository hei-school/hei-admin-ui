import {FunctionField, ShowButton} from "react-admin";
import {rowStyle} from "./utils";
import {AttachMoney} from "@mui/icons-material";
import {
  prettyPrintMoney,
  CustomDateField,
  commentFunctionRenderer,
} from "../utils";
import {HaList} from "../../ui/haList/HaList";
import {FeesFilter} from ".";

const FEES_STATUS_VALUE = {
  LATE: "Écosystéme Logiciel (EL)",
  PAID: "Transformation Numérique (TN)",
  UNPAID: "Tronc commun",
};

const ByStatusFeeList = ({status, ...props}) => {
  return (
    <HaList
      {...props}
      icon={<AttachMoney />}
      title={`Liste de tous les frais ${FEES_STATUS_VALUE[status]}`}
      resource="fees"
      listProps={{
        filterDefaultValues: {status: status || "LATE"},
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
        render={(record) => prettyPrintMoney(record.remaining_amount)}
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
};

export default ByStatusFeeList;
