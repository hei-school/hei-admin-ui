import {FunctionField, TextField} from "react-admin";
import {CurrencyExchange as Money} from "@mui/icons-material";
import {Fee} from "@haapi/typescript-client";
import {Box, Chip} from "@mui/material";
import {HaList} from "@/ui/haList/HaList";
import {EMPTY_TEXT} from "@/ui/constants";
import {FeesFilters} from "./components/FeesFilter";
import {DateField} from "../common/components/fields";
import {commentFunctionRenderer} from "../utils";
import {renderMoney} from "../common/utils/money";
import {PSP_COLORS, PSP_VALUES, rowStyle, MpbsStatusIcon} from "./utils";
import {FeesListHeader} from "./components";

const TransactionFeeList = () => {
  return (
    <Box>
      <HaList
        icon={<Money />}
        header={<FeesListHeader title="Statistiques des transactions" isMpbs />}
        title="Transactions (Mobile Money)"
        resource="fees"
        listProps={{
          filterDefaultValues: {isMpbs: true},
          storeKey: "transactionsfees",
        }}
        actions={<FeesFilters />}
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        datagridProps={rowStyle}
        filterIndicator={false}
      >
        <TextField source="student_ref" label="Référence de l'étudiant" />
        <DateField
          source="due_datetime"
          label="Limite de paiement du frais"
          showTime={false}
        />
        <TextField
          source="mpbs.psp_id"
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee: Fee) =>
            fee.mpbs ? (
              <Chip
                // @ts-ignore
                color={PSP_COLORS[fee.mpbs.psp_type!]}
                label={PSP_VALUES[fee.mpbs.psp_type!]}
              />
            ) : (
              EMPTY_TEXT
            )
          }
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
        <DateField
          source="mpbs.creation_datetime"
          label="Ajout de la référence de transaction"
          showTime
        />
        <DateField
          source="mpbs.last_datetime_verification"
          label="Dernière vérification par le PSP"
          showTime
        />
        <DateField
          source="mpbs.psp_own_datetime_verification"
          label="Vérification par PSP"
          showTime
        />
        <DateField
          source="mpbs.successfully_verified_on"
          label="Vérification réussie"
          showTime
        />
        <FunctionField label="Statut" render={() => <MpbsStatusIcon />} />
      </HaList>
    </Box>
  );
};

export default TransactionFeeList;
