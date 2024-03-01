import { Dialog, Typography, Box, IconButton } from "@mui/material"
import { CommentOutlined as CommentIcon, Close as CloseIcon } from "@mui/icons-material"
import { styled } from "@mui/styles"

import { CommentList } from "./CommentList"
import { CommentCreate } from "./CommentCreate"
import { Separator } from "./utils"
import { PALETTE_COLORS } from "../../ui/constants/palette"
import { useRole } from "../../security/hooks"

const CommentWrapper = styled('div')({
  width: "100%",
  overflowY: "auto",
  maxHeight: "500px",
  borderRadius: "15px",
  padding: "20px 0px",
  zIndex: 999
})

const DIALOG_STYLES = {
  zIndex: 9999,
  padding: 0,
  overflowX: "hidden",
  "& .MuiDialog-paper": {
    padding: "0px 20px",
    minWidth: "500px",
    maxWidth: "700px",
  },
}

export function StudentComments({ studentId, studentRef, open, onClose }) {
  const role = useRole();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={DIALOG_STYLES}
    >
      <CommentWrapper>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="h3" sx={{
            color: PALETTE_COLORS.black,
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-flex",
            opacity: .6,
            gap: 2
          }}>
            <CommentIcon sx={{ color: "#5c5b5a" }} />
            Commentaire sur {studentRef}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "#5c5b5a" }} />
          </IconButton>
        </Box>
        <Separator />
        <CommentList />
        {!role.isStudent() && <CommentCreate studentId={studentId} />}
      </CommentWrapper>
    </Dialog>
  )
}
