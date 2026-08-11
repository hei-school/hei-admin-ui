import {useToggle} from "@/hooks";
import {payingApi} from "@/providers/api";
import {PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {Box, Button} from "@mui/material";
import {Confirm, useNotify, useRecordContext, useRefresh} from "react-admin";

// TODO: le rejet appelle actuellement le même endpoint que la validation
// (`validateCreditPayments`) car aucun endpoint de rejet/invalidation n'existe
// encore côté API. À corriger dès qu'un endpoint dédié sera disponible.
const rejectCreditPayment = (paymentId: string) =>
  payingApi().validateCreditPayments([paymentId]);

const validateCreditPayment = (paymentId: string) =>
  payingApi().validateCreditPayments([paymentId]);

export const CreditPaymentActions = () => {
  const record = useRecordContext();
  const [showValidateConfirm, , toggleValidateConfirm] = useToggle();
  const [showRejectConfirm, , toggleRejectConfirm] = useToggle();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) {
    return null;
  }

  // Un paiement déjà résolu (validé ou rejeté) ne peut plus être rejoué :
  // les boutons restent visibles pour garder la colonne lisible, mais désactivés.
  const isActionable = record.status === PaymentStatus.CREATED;

  const stopPropagation = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.stopPropagation();

  const doValidate = async () => {
    toggleValidateConfirm();

    try {
      await validateCreditPayment(record.id as string);
      notify("Paiement validé avec succès.", {type: "success"});
      refresh();
    } catch (error) {
      console.error(error);
      notify("Une erreur s'est produite lors de la validation du paiement.", {
        type: "error",
      });
    }
  };

  const doReject = async () => {
    toggleRejectConfirm();

    try {
      await rejectCreditPayment(record.id as string);
      notify("Paiement rejeté avec succès.", {type: "success"});
      refresh();
    } catch (error) {
      console.error(error);
      notify("Une erreur s'est produite lors du rejet du paiement.", {
        type: "error",
      });
    }
  };

  return (
    <Box display="flex" gap={1} justifyContent="center">
      <Button
        color="success"
        size="small"
        variant="outlined"
        disabled={!isActionable}
        data-testid={`validate-payment-${record.id}`}
        onClick={(event) => {
          stopPropagation(event);
          toggleValidateConfirm();
        }}
      >
        Valider
      </Button>
      <Button
        color="error"
        size="small"
        variant="outlined"
        disabled={!isActionable}
        data-testid={`reject-payment-${record.id}`}
        onClick={(event) => {
          stopPropagation(event);
          toggleRejectConfirm();
        }}
      >
        Rejeter
      </Button>

      <Confirm
        fullWidth
        sx={{zIndex: 99999}}
        isOpen={showValidateConfirm}
        title="Valider le paiement"
        content="Confirmez-vous la validation de ce paiement par crédit ?"
        onConfirm={doValidate}
        onClose={toggleValidateConfirm}
        confirmColor="primary"
        confirm="Valider"
      />
      <Confirm
        fullWidth
        sx={{zIndex: 99999}}
        isOpen={showRejectConfirm}
        title="Rejeter le paiement"
        content="Confirmez-vous le rejet de ce paiement par crédit ?"
        onConfirm={doReject}
        onClose={toggleRejectConfirm}
        confirmColor="warning"
        confirm="Rejeter"
      />
    </Box>
  );
};
