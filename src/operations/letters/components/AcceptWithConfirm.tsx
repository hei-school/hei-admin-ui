import {FC, useState} from "react";
import {Confirm, useUpdate} from "react-admin";
import {Box, Button} from "@mui/material";
import {CheckCircle} from "@mui/icons-material";
import {useNotify} from "@/hooks";

export const AcceptWithConfirm: FC<{letterId: string}> = ({letterId}) => {
  const [open, setOpen] = useState(false);
  const [update, {isLoading}] = useUpdate();
  const notify = useNotify();

  const confirmLetter = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const onConfirm = () => {
    update(
      "student-letters",
      {
        id: letterId,
        data: {
          id: letterId,
          status: "RECEIVED",
          reason_for_refusal: null,
        },
        meta: {
          method: "UPDATE",
        },
      },
      {
        onSuccess: () => {
          notify("Lettre acceptée avec succès", {
            type: "success",
          });
          handleDialogClose();
        },
        onError: () => {
          notify("Erreur lors de l'acceptation de la lettre", {
            type: "error",
          });
          handleDialogClose();
        },
      }
    );
  };

  return (
    <Box data-testid="accept-letter-button">
      <Button
        startIcon={<CheckCircle />}
        sx={{
          "color": "green",
          "width": "100%",
          "display": "flex",
          "justifyContent": "flex-start",
          "backgroundColor": "#c8e6c9",
          "&:hover": {
            backgroundColor: "#81c784",
            color: "white",
          },
        }}
        onClick={confirmLetter}
        disabled={isLoading}
      >
        Accepter
      </Button>
      <Confirm
        isOpen={open}
        title="Acceptation de la lettre"
        content="Voulez-vous vraiment accepter cette lettre ?"
        onConfirm={onConfirm}
        onClose={handleDialogClose}
      />
    </Box>
  );
};
