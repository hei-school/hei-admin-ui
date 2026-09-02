import {renderMoney} from "@/operations/common/utils/money";
import {CreditPaymentActions} from "@/operations/payments/components/CreditPaymentActions";
import {CreditPaymentStatusFilterButtons} from "@/operations/payments/components/CreditPaymentStatusFilterButtons";
import {PaymentStatusIcon} from "@/operations/payments/components/PaymentStatusIcon";
import {HaList} from "@/ui/haList/HaList";
import {Fee, Payment, PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {AccountBalanceWallet as CreditIcon} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {FunctionField, TextField} from "react-admin";
import {DateField} from "../common/components/fields";

// Le client généré ne modélise plus les paiements par crédit séparément :
// l'endpoint type désormais sa réponse en Payment, qui ne déclare pas le fee imbriqué.
type CreditPayment = Payment & {fee?: Fee};

const CreditPaymentList = () => {
  return (
    <Box>
      <HaList
        icon={<CreditIcon />}
        title="Liste des paiements par crédit"
        resource="credit-payments"
        filterButtons={<CreditPaymentStatusFilterButtons />}
        actions={undefined}
        filterIndicator={false}
        datagridProps={{rowClick: false}}
        listProps={{
          filterDefaultValues: {status: PaymentStatus.CREATED},
        }}
      >
        <FunctionField
          label="Étudiant"
          render={(payment: CreditPayment) =>
            payment.fee?.student_ref ?? payment.fee?.student_first_name ?? "—"
          }
        />
        <DateField
          source="creation_datetime"
          label="Date de paiement"
          showTime={false}
        />
        <FunctionField
          label="Montant"
          render={(payment: CreditPayment) => (
            <Typography variant="body2" fontWeight={600}>
              {renderMoney(payment.amount!)}
            </Typography>
          )}
        />
        <TextField source="comment" label="Commentaire" />
        <FunctionField
          label="Statut"
          render={() => <PaymentStatusIcon />}
          textAlign="center"
        />
        <FunctionField
          label="Action"
          render={() => <CreditPaymentActions />}
          textAlign="center"
        />
      </HaList>
    </Box>
  );
};

export default CreditPaymentList;
