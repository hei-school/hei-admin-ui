import {getMonthFilters} from "@/providers/utils";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {formatDate} from "@/utils/date";
import {Fee} from "@haapi-b0fc7615/typescript-client";
import {CurrencyExchange as Money} from "@mui/icons-material";
import {Box, Chip} from "@mui/material";
import {FunctionField, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {renderMoney} from "../common/utils/money";
import {commentFunctionRenderer} from "../utils";
import {FeesListHeader} from "./components";
import {MpbsStatusIcon, PSP_COLORS, PSP_VALUES, rowStyle} from "./utils";

const FEES_LIST_DEFAULT_FILTER = {
  isMpbs: true,
  ...getMonthFilters(),
};

const TransactionFeeList = () => {
  return (
    <Box>
      <HaList
        icon={<Money />}
        header={<FeesListHeader title="Statistiques des transactions" isMpbs />}
        title="Transactions (Mobile Money)"
        resource="fees"
        listProps={{
          filterDefaultValues: FEES_LIST_DEFAULT_FILTER,
          storeKey: "transactionsfees",
        }}
        actions={undefined}
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        datagridProps={rowStyle}
        filterIndicator={true}
      >
        <TextField source="student_ref" label="Référence de l'étudiant" />
        <DateField
          source="due_datetime"
          label="Limite de paiement du frais"
          showTime={false}
        />
        <FunctionField
          render={(fee) => fee?.mpbs?.at(-1)?.psp_id}
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee: Fee) => {
            const last = fee.mpbs?.at(-1);
            if (!last || last.psp_type == null) return EMPTY_TEXT;
            const pspType = last.psp_type;
            return (
              <Chip color={PSP_COLORS[pspType]} label={PSP_VALUES[pspType]} />
            );
          }}
          label="Type de PSP"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          source="comment"
          render={commentFunctionRenderer}
          label="Commentaire"
        />
        <FunctionField
          label="Reste à payer"
          render={(fee: Fee) => renderMoney(fee.remaining_amount!)}
        />
        <FunctionField
          render={(fee) => formatDate(fee?.mpbs?.at(-1)?.creation_datetime)}
          label="Ajout de la référence de transaction"
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.last_datetime_verification)
          }
          label="Dernière vérification par HEI"
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.psp_own_datetime_verification)
          }
          label="Vérification par PSP"
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.successfully_verified_on)
          }
          label="Vérification réussie"
        />
        <FunctionField label="Statut" render={() => <MpbsStatusIcon />} />
      </HaList>
    </Box>
  );
};

export default TransactionFeeList;
