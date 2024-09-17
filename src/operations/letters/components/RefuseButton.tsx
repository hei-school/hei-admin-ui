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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
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
    handleClose();
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
        onClick={handleClickOpen}
      >
        Refuser
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleConfirm}>Confirmer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
