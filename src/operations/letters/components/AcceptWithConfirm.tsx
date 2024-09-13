import {FC, useState} from "react";
import {Confirm, useUpdate} from "react-admin";
import {Box, Button} from "@mui/material";
import {CheckCircle} from "@mui/icons-material";

export const AcceptWithConfirm: FC<{letterId: string}> = ({letterId}) => {
  const [open, setOpen] = useState(false);
  const [update] = useUpdate();
  const handleConfirm = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const onConfirm = () => {
    update("student-letters", {
      id: letterId,
      data: {
        id: letterId,
        status: "RECEIVED",
        reason_for_refusal: null,
      },
      meta: {
        method: "UPDATE",
      },
    });
    handleDialogClose();
  };

  return (
    <Box>
      <Button
        startIcon={<CheckCircle />}
        aria-hidden:false
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
        onClick={handleConfirm}
      >
        Accepter
      </Button>
      <Confirm
        isOpen={open}
        title="Acceptation du lettre"
        content="Voulez vous vraiment accepter ce lettre? "
        onConfirm={onConfirm}
        onClose={handleDialogClose}
      />
    </Box>
  );
};
