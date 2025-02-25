import {useNotify} from "@/hooks";
import {Unpublished} from "@mui/icons-material";
import {Box, Button, TextField} from "@mui/material";
import {FC, useState} from "react";
import {Confirm, useRefresh, useUpdate} from "react-admin";

export const RefuseButton: FC<{letterId: string}> = ({letterId}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [update, {isLoading}] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const confirmRefusal = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const onConfirm = () => {
    if (!reason) {
      notify("Veuillez fournir une raison pour le refus.", {type: "warning"});
      return;
    }
    update(
      "users-letters",
      {
        id: letterId,
        data: {
          id: letterId,
          status: "REJECTED",
          reason_for_refusal: reason,
        },
        meta: {
          method: "UPDATE",
        },
      },
      {
        onSuccess: () => {
          notify("Lettre refusée avec succès", {type: "success"});
          refresh();
          handleDialogClose();
        },
        onError: () => {
          notify("Erreur lors du refus de la lettre", {type: "error"});
          refresh();
          handleDialogClose();
        },
      }
    );
  };

  return (
    <Box>
      <Button
        data-testid="refuse-button"
        id="refuse-button"
        startIcon={<Unpublished />}
        sx={{
          "color": "#d84315",
          "width": "100%",
          "display": "flex",
          "justifyContent": "flex-start",
          "backgroundColor": "#ffccbc",
          "&:hover": {
            backgroundColor: "#ff8a65",
            color: "white",
          },
        }}
        onClick={confirmRefusal}
        disabled={isLoading}
      >
        Refuser
      </Button>
      <Confirm
        isOpen={open}
        title="Refus de la lettre"
        content={
          <TextField
            required
            fullWidth
            label="Raison du refus"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            data-testid="refuse-reason-input"
          />
        }
        onConfirm={onConfirm}
        onClose={handleDialogClose}
        sx={{
          "& .MuiPaper-root": {
            width: "500px",
          },
        }}
      />
    </Box>
  );
};
