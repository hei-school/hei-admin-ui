import {useToggle} from "@/hooks/useToggle";
import {FeeRecord} from "@/operations/fees/hooks/useFeesToArchive";
import {payingApi} from "@/providers/api";
import {toApiIds} from "@/providers/feeProvider";
import {CONFIRM_DIALOG_Z_INDEX} from "@/ui/constants/common_styles";
import {ArchiveStatusEnum} from "@haapi-b0fc7615/typescript-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import CancelIcon from "@mui/icons-material/Cancel";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
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

const runArchiveAction = async (
  action: () => Promise<unknown>,
  successMessage: string,
  onDone: () => void,
  notify: ReturnType<typeof useNotify>
) => {
  try {
    await action();
    notify(successMessage, {type: "success"});
    onDone();
  } catch (error) {
    console.error(error);
    notify("Une erreur s'est produite.", {type: "error"});
  }
};

const RejectArchiveDialog = ({
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
      fullWidth
      maxWidth="sm"
      sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
    >
      <DialogTitle>Rejet de l'archivage</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>
          Confirmez-vous le rejet de cette demande d'archivage ? Une raison est
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button
          variant="contained"
          color="error"
          disabled={trimmedReason.length === 0}
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

export const FeeArchiveRowActions = ({
  tab,
  onDone,
}: {
  tab: ArchiveStatusEnum;
  onDone?: () => void;
}) => {
  const record = useRecordContext<FeeRecord>();
  const notify = useNotify();
  const refresh = useRefresh();
  const [showValidate, , toggleValidate] = useToggle();
  const [showReject, , toggleReject] = useToggle();
  const [showReArchive, , toggleReArchive] = useToggle();

  if (!record) {
    return null;
  }

  const {studentId, feeId} = toApiIds(record.id);

  const doDone = () => {
    refresh();
    onDone?.();
  };

  const doUpdate = (
    status: ArchiveStatusEnum,
    successMessage: string,
    reason?: string
  ) =>
    runArchiveAction(
      () =>
        payingApi().updateFeeArchiveStatus(studentId, feeId, {status, reason}),
      successMessage,
      doDone,
      notify
    );

  const doReArchive = () => {
    toggleReArchive();
    runArchiveAction(
      () => payingApi().archiveStudentFee(studentId, feeId),
      "Demande d'archivage envoyée avec succès.",
      doDone,
      notify
    );
  };

  if (tab === ArchiveStatusEnum.TO_ARCHIVE) {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          color="warning"
          startIcon={<ArchiveIcon />}
          onClick={toggleValidate}
        >
          Archiver
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={toggleReject}
        >
          Rejeter
        </Button>
        <Confirm
          sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
          isOpen={showValidate}
          title="Archivage de frais"
          content="Confirmez-vous l'archivage de ce frais ? Il ne pourra plus être payé ni modifié."
          onConfirm={() => {
            toggleValidate();
            doUpdate(ArchiveStatusEnum.ARCHIVED, "Frais archivé avec succès.");
          }}
          onClose={toggleValidate}
          confirmColor="warning"
          confirm="Archiver"
        />
        <RejectArchiveDialog
          open={showReject}
          onClose={toggleReject}
          onConfirm={(reason) => {
            toggleReject();
            doUpdate(
              ArchiveStatusEnum.REJECTED,
              "Demande d'archivage rejetée.",
              reason
            );
          }}
        />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        size="small"
        variant="outlined"
        color="warning"
        startIcon={<UnarchiveIcon />}
        onClick={toggleReArchive}
      >
        Réarchiver
      </Button>
      <Confirm
        sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
        isOpen={showReArchive}
        title="Demande d'archivage"
        content="Confirmez-vous la demande d'archivage de ce frais ?"
        onConfirm={doReArchive}
        onClose={toggleReArchive}
        confirmColor="warning"
        confirm="Réarchiver"
      />
    </Box>
  );
};
