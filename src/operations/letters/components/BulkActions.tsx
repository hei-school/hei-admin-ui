import {useNotify} from "@/hooks";
import {CheckCircle, Unpublished} from "@mui/icons-material";
import {Box, Button, TextField} from "@mui/material";
import {FC, useState} from "react";
import {Confirm, useRefresh, useUpdate} from "react-admin";

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export const BulkActions: FC<BulkActionsProps> = ({
  selectedIds,
  onClearSelection,
}) => {
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [refuseOpen, setRefuseOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [update, {isLoading}] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleAcceptClick = () => setAcceptOpen(true);
  const handleRefuseClick = () => setRefuseOpen(true);
  const handleAcceptClose = () => setAcceptOpen(false);
  const handleRefuseClose = () => setRefuseOpen(false);

  const onAcceptConfirm = () => {
    const updateData = selectedIds.map((letterId) => ({
      id: letterId,
      status: "RECEIVED",
      reason_for_refusal: null,
    }));

    update(
      "users-letters",
      {
        id: selectedIds[0],
        data: updateData,
        meta: {
          method: "UPDATE",
        },
      },
      {
        onSuccess: () => {
          notify(`${selectedIds.length} lettres acceptées avec succès`, {
            type: "success",
          });
          refresh();
          handleAcceptClose();
          onClearSelection();
        },
        onError: () => {
          notify("Erreur lors de l'acceptation des lettres", {
            type: "error",
          });
        },
      }
    );
  };

  const onRefuseConfirm = () => {
    if (!reason) {
      notify("Veuillez fournir une raison pour le refus.", {type: "warning"});
      return;
    }

    const updateData = selectedIds.map((letterId) => ({
      id: letterId,
      status: "REJECTED",
      reason_for_refusal: reason,
    }));

    update(
      "users-letters",
      {
        id: selectedIds[0],
        data: updateData,
        meta: {
          method: "UPDATE",
        },
      },
      {
        onSuccess: () => {
          notify(`${selectedIds.length} lettres refusées avec succès`, {
            type: "success",
          });
          refresh();
          handleRefuseClose();
          onClearSelection();
        },
        onError: () => {
          notify("Erreur lors du refus des lettres", {
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "0.5rem",
      }}
      data-testid="bulk-actions"
    >
      <Button
        startIcon={<CheckCircle />}
        sx={{
          "color": "white",
          "backgroundColor": "#4caf50",
          "borderRadius": "4px",
          "textTransform": "none",
          "fontWeight": 500,
          "padding": "6px 12px",
          "&:hover": {
            backgroundColor: "#43a047",
          },
        }}
        onClick={handleAcceptClick}
        disabled={isLoading || selectedIds.length === 0}
        data-testid="bulk-accept-button"
        size="small"
      >
        Accepter
      </Button>
      <Button
        startIcon={<Unpublished />}
        sx={{
          "color": "white",
          "backgroundColor": "#f44336",
          "borderRadius": "4px",
          "textTransform": "none",
          "fontWeight": 500,
          "padding": "6px 12px",
          "&:hover": {
            backgroundColor: "#e53935",
          },
        }}
        onClick={handleRefuseClick}
        disabled={isLoading || selectedIds.length === 0}
        data-testid="bulk-refuse-button"
        size="small"
      >
        Refuser
      </Button>

      <Confirm
        isOpen={acceptOpen}
        title="Acceptation des lettres"
        content={`Voulez-vous vraiment accepter ces ${selectedIds.length} lettres ?`}
        onConfirm={onAcceptConfirm}
        onClose={handleAcceptClose}
      />

      <Confirm
        isOpen={refuseOpen}
        title="Refus des lettres"
        content={
          <TextField
            required
            fullWidth
            label="Raison du refus"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            data-testid="bulk-refuse-reason-input"
          />
        }
        onConfirm={onRefuseConfirm}
        onClose={handleRefuseClose}
        sx={{
          "& .MuiPaper-root": {
            width: "500px",
          },
        }}
      />
    </Box>
  );
};
