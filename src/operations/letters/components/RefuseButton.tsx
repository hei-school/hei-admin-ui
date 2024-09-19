import {FC, useState} from "react";
import {useUpdate} from "react-admin";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import {Unpublished} from "@mui/icons-material";

export const RefuseButton: FC<{letterId: string}> = ({letterId}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [update] = useUpdate();

  const onConfirm = () => {
    update("student-letters", {
      id: letterId,
      data: {
        id: letterId,
        status: "REJECTED",
        reason_for_refusal: reason,
      },
      meta: {
        method: "UPDATE",
      },
    });
    setOpen(false);
  };

  return (
    <Box>
      <Button
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
        onClick={() => setOpen(true)}
      >
        Refuser
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            width: "500px",
          },
        }}
      >
        <DialogContent>
          <TextField
            required
            fullWidth
            label="Raison du refus"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={onConfirm}>Confirmer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
