import {
  Close as CloseIcon,
  CommentOutlined as CommentIcon,
} from "@mui/icons-material";
import {Box, Dialog, IconButton, styled, Typography} from "@mui/material";

import {PALETTE_COLORS} from "@/haTheme";
import {FC} from "react";
import {CommentList} from "./CommentList";
import {Separator} from "./utils";

const CommentWrapper = styled("div")({
  width: "100%",
  borderRadius: "15px",
  paddingTop: "20px",
  zIndex: 9999,
});

const DIALOG_STYLES = {
  "zIndex": 9999,
  "padding": 0,
  "overflowX": "hidden",
  "& .MuiDialog-paper": {
    padding: "0 20px 20px 20px",
    width: "100%",
    maxWidth: "850px",
  },
};

export const StudentComments: FC<{
  title?: string;
  studentId?: string;
  open: boolean;
  onClose: () => void;
}> = ({title, studentId, open, onClose}) => {
  return (
    <Dialog open={open} onClose={onClose} sx={DIALOG_STYLES}>
      <CommentWrapper>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: PALETTE_COLORS.primary,
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline-flex",
              gap: 2,
            }}
          >
            <CommentIcon />
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{color: PALETTE_COLORS.primary}} />
          </IconButton>
        </Box>
        <Separator style={""} />
        <CommentList studentId={studentId} close={onClose} />
      </CommentWrapper>
    </Dialog>
  );
};
