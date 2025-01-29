import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {Fee} from "@haapi/typescript-client";
import {Download, CurrencyExchange as Money} from "@mui/icons-material";
import {Box, Chip} from "@mui/material";
import {useState} from "react";
import {Button, FunctionField, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {renderMoney} from "../common/utils/money";
import {commentFunctionRenderer} from "../utils";
import {FeesListHeader} from "./components";
import {FeesFilters} from "./components/FeesFilter";
import {MpbsStatusIcon, PSP_COLORS, PSP_VALUES, rowStyle} from "./utils";
import {FeesExport} from "./utils/FeesExport";

const TransactionFeeList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
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
        actions={
          <>
            <FeesFilters />
            <Button
              startIcon={<Download />}
              onClick={handleOpenDialog}
              label="Exporter"
              sx={{
                color: "black",
                opacity: "0.8",
                padding: "0.5rem 1.1rem",
                textTransform: "none",
                gap: "0.8rem",
                width: "100%",
                justifyContent: "flex-start",
              }}
            />
            {openDialog && (
              <FeesExport open={openDialog} onClose={handleCloseDialog} />
            )}
          </>
        }
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
