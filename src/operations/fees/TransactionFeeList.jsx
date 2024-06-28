import {CurrencyExchange as Money} from "@mui/icons-material";
import {Chip} from "@mui/material";
import {FeeStatusEnum} from "@haapi/typescript-client";
import {HaList} from "../../ui/haList/HaList";
import {FeesFilter} from "./components/FeesFilter";
import {DateField} from "../common/components/fields";
import {FunctionField, TextField} from "react-admin";
import {commentFunctionRenderer} from "../utils";
import {renderMoney} from "../common/utils/money";
import {PSP_COLORS, PSP_VALUES, rowStyle} from "./utils";
import {EMPTY_TEXT} from "@/ui/constants";

const TransactionFeeList = () => (
  <HaList
    icon={<Money />}
    title="Liste des transactions (Mobile Money)"
    resource="fees"
    listProps={{
      filterDefaultValues: {isMpbs: true},
    }}
    datagridProps={rowStyle}
    filterIndicator={false}
  >
    <DateField source="due_datetime" label="Date limite" showTime={false} />
    <TextField
      source="mpbs.psp_id"
      label="Référence de la transaction"
      emptyText={EMPTY_TEXT}
    />
    <FunctionField
      render={(fee) =>
        fee.mpbs ? (
          <Chip
            color={PSP_COLORS[fee.mpbs?.psp_type]}
            label={PSP_VALUES[fee.mpbs?.psp_type]}
          />
        ) : (
          EMPTY_TEXT
        )
      }
      label="Type de transaction"
      emptyText={EMPTY_TEXT}
    />
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
  </HaList>
);

export default TransactionFeeList;
