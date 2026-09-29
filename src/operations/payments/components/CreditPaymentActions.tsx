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
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import {useState} from "react";
import {Confirm, useNotify, useRecordContext, useRefresh} from "react-admin";

const rejectCreditPayment = (paymentId: string, reason: string) =>
  payingApi().rejectCreditPayments({payment_ids: [paymentId], reason});

const validateCreditPayment = (paymentId: string) =>
  payingApi().validateCreditPayments([paymentId]);

const RejectPaymentDialog = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) => {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onClick={(event) => event.stopPropagation()}
      fullWidth
      maxWidth="sm"
      sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
    >
      <DialogTitle id="alert-dialog-title">Rejeter le paiement</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>
          Confirmez-vous le rejet de ce paiement par crédit ? Une raison est
          obligatoire.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={2}
          label="Motif du rejet"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
          error={reason.length > 0 && trimmedReason.length === 0}
          helperText={
            reason.length > 0 && trimmedReason.length === 0
              ? "Le motif ne peut pas être vide."
              : " "
          }
          inputProps={{"data-testid": "reject-payment-reason"}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button
          variant="contained"
          color="error"
          disabled={trimmedReason.length === 0}
          data-testid="reject-payment-confirm"
          onClick={() => {
            onConfirm(trimmedReason);
            setReason("");
          }}
        >
          Rejeter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CreditPaymentActions = () => {
  const record = useRecordContext();
  const [showValidateConfirm, , toggleValidateConfirm] = useToggle();
  const [showRejectConfirm, , toggleRejectConfirm] = useToggle();
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
  const doReject = async (reason: string) => {
    toggleRejectConfirm();
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
      <RejectPaymentDialog
        open={showRejectConfirm}
        onClose={toggleRejectConfirm}
        onConfirm={doReject}
      />
    </Box>
  );
};
