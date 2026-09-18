import {useToggle} from "@/hooks/useToggle";
import {payingApi} from "@/providers/api";
import {CONFIRM_DIALOG_Z_INDEX} from "@/ui/constants/common_styles";
import {PaymentStatus} from "@haapi-b0fc7615/typescript-client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {useState} from "react";
import {Confirm, useNotify, useRecordContext, useRefresh} from "react-admin";

const rejectCreditPayment = (paymentId: string, reason: string) =>
  payingApi().rejectCreditPayments({payment_ids: [paymentId], reason});

const validateCreditPayment = (paymentId: string) =>
  payingApi().validateCreditPayments([paymentId]);

export const CreditPaymentActions = () => {
  const record = useRecordContext();
  const [showValidateConfirm, , toggleValidateConfirm] = useToggle();
  const [showRejectConfirm, , toggleRejectConfirm] = useToggle();
  const [rejectReason, setRejectReason] = useState("");
  const notify = useNotify();
  const refresh = useRefresh();
  if (!record) {
    return null;
  }
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
  const closeReject = () => {
    toggleRejectConfirm();
    setRejectReason("");
  };
  const doReject = async () => {
    const reason = rejectReason.trim();
    closeReject();
    try {
      await rejectCreditPayment(record.id as string, reason);
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
        sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
        isOpen={showValidateConfirm}
        title="Valider le paiement"
        content="Confirmez-vous la validation de ce paiement par crédit ?"
        onConfirm={doValidate}
        onClose={toggleValidateConfirm}
        confirmColor="primary"
        confirm="Valider"
      />
      <Dialog
        fullWidth
        maxWidth="sm"
        sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
        open={showRejectConfirm}
        onClose={closeReject}
        onClick={(event) => event.stopPropagation()}
      >
        <DialogTitle>Rejeter le paiement</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              required
              label="Raison du rejet"
              placeholder="Veuillez indiquer la raison du rejet de ce paiement..."
              helperText="Ce champ est obligatoire"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              inputProps={{"data-testid": "reject-payment-reason"}}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReject}>Annuler</Button>
          <Button
            variant="contained"
            color="warning"
            disabled={!rejectReason.trim()}
            data-testid="confirm-reject-payment"
            onClick={doReject}
          >
            Rejeter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
