import { Dialog, Typography, Box, IconButton } from "@mui/material"
import { CommentOutlined as CommentIcon, Close as CloseIcon } from "@mui/icons-material"
import { styled } from "@mui/styles"

import { CommentList } from "./CommentList"
import { Separator } from "./utils"
import { PALETTE_COLORS } from "../../ui/constants/palette"

const CommentWrapper = styled('div')({
  width: "100%",
  borderRadius: "15px",
  padding: "20px 0px",
  zIndex: 999
})

const DIALOG_STYLES = {
  zIndex: 9999,
  padding: 0,
  overflowX: "hidden",
  "& .MuiDialog-paper": {
    padding: "0 20px 20px 20px",
    minWidth: "700px",
    maxWidth: "800px",
  },
}

export function StudentComments({ studentId, open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={DIALOG_STYLES}
    >
      <CommentWrapper>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="h3" sx={{
            color: PALETTE_COLORS.primary,
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-flex",
            gap: 2
          }}>
            <CommentIcon />
            Liste de commentaires
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: PALETTE_COLORS.primary }} />
          </IconButton>
        </Box>
        <Separator />
        <CommentList studentId={studentId}/>
      </CommentWrapper>
    </Dialog>
  )
}
