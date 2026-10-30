import {useToggle} from "@/hooks";
import {useRole} from "@/security/hooks";
import {Complaint, ComplaintStatus} from "@haapi-3d601c85/typescript-client";
import {
  AssignmentInd,
  CheckCircle,
  HowToReg,
  Unpublished,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import {useState} from "react";
import {Confirm, useRecordContext} from "react-admin";
import {AssigneeAutocompleteInput} from "./AssigneeAutocompleteInput";
import {useComplaintStatusActions} from "./useComplaintStatusActions";

export const ComplaintStatusActions = () => {
  const complaint = useRecordContext<Complaint>();
  const {isStudent} = useRole();
  const {isLoading, startTreating, resolve, reject, addAssignees} =
    useComplaintStatusActions(complaint ?? null);

  const [isAssigning, , toggleAssigning] = useToggle();
  const [isStarting, , toggleStarting] = useToggle();
  const [isResolving, , toggleResolving] = useToggle();
  const [isRejecting, , toggleRejecting] = useToggle();
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState("");

  if (!complaint || isStudent()) return null;

  const {status} = complaint;
  const canReject =
    status === ComplaintStatus.CREATED || status === ComplaintStatus.ASSIGNED;
  const canStart =
    status === ComplaintStatus.CREATED || status === ComplaintStatus.ASSIGNED;
  const canResolve = status === ComplaintStatus.IN_PROGRESS;
  const canAssign =
    status === ComplaintStatus.CREATED || status === ComplaintStatus.ASSIGNED;

  const submitReject = () => {
    if (!rejectReason.trim()) return;
    reject(rejectReason);
    setRejectReason("");
    toggleRejecting();
  };

  const submitAssign = () => {
    if (assigneeIds.length === 0) return;
    addAssignees(assigneeIds);
    setAssigneeIds([]);
    toggleAssigning();
  };

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        {canAssign && (
          <Button
            data-testid="assign-complaint"
            variant="outlined"
            startIcon={<AssignmentInd />}
            disabled={isLoading}
            onClick={toggleAssigning}
          >
            Assigner
          </Button>
        )}
        {canStart && (
          <Button
            data-testid="start-complaint"
            variant="contained"
            color="primary"
            startIcon={<HowToReg />}
            disabled={isLoading}
            onClick={toggleStarting}
          >
            Démarrer le traitement
          </Button>
        )}
        {canResolve && (
          <Button
            data-testid="resolve-complaint"
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            disabled={isLoading}
            onClick={toggleResolving}
          >
            Résoudre
          </Button>
        )}
        {canReject && (
          <Button
            data-testid="reject-complaint"
            variant="outlined"
            color="error"
            startIcon={<Unpublished />}
            disabled={isLoading}
            onClick={toggleRejecting}
          >
            Rejeter
          </Button>
        )}
      </Stack>

      <Dialog
        open={isAssigning}
        onClose={toggleAssigning}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Assigner la réclamation</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <AssigneeAutocompleteInput
              value={assigneeIds}
              onChange={setAssigneeIds}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleAssigning}>Annuler</Button>
          <Button
            variant="contained"
            disabled={assigneeIds.length === 0}
            onClick={submitAssign}
          >
            Assigner
          </Button>
        </DialogActions>
      </Dialog>

      <Confirm
        isOpen={isStarting}
        title="Démarrer le traitement"
        content="Voulez-vous démarrer le traitement de cette réclamation ?"
        confirm="Démarrer"
        onConfirm={() => {
          startTreating();
          toggleStarting();
        }}
        onClose={toggleStarting}
      />

      <Confirm
        isOpen={isResolving}
        title="Résolution de la réclamation"
        content="Voulez-vous marquer cette réclamation comme résolue ?"
        confirm="Résoudre"
        onConfirm={() => {
          resolve();
          toggleResolving();
        }}
        onClose={toggleResolving}
      />

      <Dialog
        open={isRejecting}
        onClose={toggleRejecting}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rejet de la réclamation</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              required
              label="Raison du rejet"
              helperText="Ce champ est obligatoire"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleRejecting}>Annuler</Button>
          <Button
            variant="contained"
            color="error"
            disabled={!rejectReason.trim()}
            onClick={submitReject}
          >
            Confirmer le rejet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
