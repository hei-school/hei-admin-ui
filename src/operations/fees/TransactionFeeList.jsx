import {
  CurrencyExchange as Money,
  AttachMoney,
  Cancel,
  Pending,
  Check,
} from "@mui/icons-material";
import {Chip, Typography} from "@mui/material";
import {HaList} from "@/ui/haList/HaList";
import {EMPTY_TEXT} from "@/ui/constants";
import {FeesFilters} from "./components/FeesFilter";
import {DateField} from "../common/components/fields";
import {FunctionField, TextField, useGetOne} from "react-admin";
import {commentFunctionRenderer} from "../utils";
import {renderMoney} from "../common/utils/money";
import {PSP_COLORS, PSP_VALUES, rowStyle, MpbsStatusIcon} from "./utils";
import {NOOP_ID} from "@/utils/constants";
import {ListHeader} from "../common/components";

const TransactionFeeList = () => {
  const {
    data: stats = {
      total_fees: "...",
      paid_fees: "...",
      unpaid_fees: "...",
    },
  } = useGetOne("stats", {id: NOOP_ID, meta: {resource: "fees"}});

  const headerCardContent = [
    {
      title: "Total",
      icon: <AttachMoney fontSize="medium" />,
      total: stats.total_fees,
    },
    {
      title: "Non-payés",
      icon: <Pending fontSize="medium" />,
      total: stats.unpaid_fees,
    },
    {
      title: "Payés",
      icon: <Check fontSize="medium" />,
      total: stats.paid_fees,
    },
    {
      title: "En retard",
      icon: <Cancel fontSize="medium" />,
      total:
        stats.total_fees == "..."
          ? "..."
          : stats.total_fees - (stats.paid_fees + stats.unpaid_fees),
    },
  ];
  return (
    <>
      <ListHeader
        cardContents={headerCardContent}
        title={
          <Typography variant="h6" fontWeight="bold">
            Statistiques des frais de ce mois-ci
          </Typography>
        }
      />
      <HaList
        icon={<Money />}
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
          render={(fee) =>
            fee.mpbs?.psp_type ? (
              <Chip
                color={PSP_COLORS[fee.mpbs?.psp_type]}
                label={PSP_VALUES[fee.mpbs?.psp_type]}
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
          render={(fee) => renderMoney(fee.remaining_amount)}
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
    </>
  );
};

export default TransactionFeeList;
