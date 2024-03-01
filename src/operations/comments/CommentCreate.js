import { Create, Form, TextInput, useCreate } from "react-admin"
import { Box, IconButton, CircularProgress } from "@mui/material"
import { v4 as uuid } from "uuid"
import { Send as SendIcon } from "@mui/icons-material"
import authProvider from "../../providers/authProvider"
import { PALETTE_COLORS } from "../../ui/constants/palette"
import { useState } from "react"

function SaveCommentButton({ }) {
  const [, { isLoading }] = useCreate();

  return (
    isLoading ? (
      <CircularProgress size={35} sx={{ marginTop: 1 }} />
    ) : (
      <IconButton
        type="submit"
        sx={{ marginTop: "10px", color: PALETTE_COLORS.primary }}
      >
        <SendIcon />
      </IconButton>
    )
  )
}

export function CommentCreate({ studentId, doReset }) {
  const [commentContent, setCommentContent] = useState("");
  const observerId = authProvider.getCachedWhoami().id;

  const resetField = () => {
    setCommentContent("");
    doReset();
    return "";
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <Create
        resource="comments"
        title=" "
        redirect={resetField}
        transform={(comment) => ({
          id: uuid(),
          student_id: studentId,
          observer_id: observerId,
          content: comment.content
        })}
        sx={{
          padding: 0,
          boxShadow: "none",
          width: "100%",
          "& #content-helper-text": {
            display: "none",
            padding: 0,
            margin: 0
          },
          "& .MuiPaper-root": {
            boxShadow: "none"
          }
        }}
      >
        <Form>
          <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
            <TextInput
              multiline
              fullWidth
              required
              variant="outlined"
              label="Commentaire"
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              source="content"
              size="small"
              sx={{
                minWidth: "170px",
                fontSize: "14px",
              }}
            />
            <SaveCommentButton onClick={doReset} />
          </Box>
        </Form>
      </Create>
    </Box >
  )
}
