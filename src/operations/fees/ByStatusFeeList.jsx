import {
  FunctionField,
  ShowButton,
  TextField,
  useList,
  useListContext,
} from "react-admin";
import {AttachMoney} from "@mui/icons-material";
import {FeeStatusEnum} from "@haapi/typescript-client";
import {HaList} from "@/ui/haList/HaList";
import {FeesFilters} from "./components/FeesFilter";
import {DateField} from "../common/components/fields";
import {commentFunctionRenderer} from "../utils";
import {renderMoney} from "../common/utils/money";
import {rowStyle} from "./utils";

const ByStatusFeeList = (props) => (
  <HaList
    {...props}
    icon={<AttachMoney />}
    title="Liste des frais (en retard par défaut)"
    resource="fees"
    listProps={{
      filterDefaultValues: {status: FeeStatusEnum.LATE},
      storeKey: "latefees",
    }}
    actions={<FeesFilters />}
    mainSearch={{label: "Référence étudiant", source: "student_ref"}}
    filterIndicator={false}
    datagridProps={{
      rowClick: (id) => `/fees/${id}/show`,
      rowStyle,
    }}
  >
    <TextField source="student_ref" label="Référence de l'étudiant" />
    <DateField source="due_datetime" label="Date limite" showTime={false} />
    <FunctionField
      source="comment"
      render={commentFunctionRenderer}
      label="Commentaire"
    />
    <FunctionField
      label="Reste à payer"
      render={(fee) => renderMoney(fee.remaining_amount)}
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
