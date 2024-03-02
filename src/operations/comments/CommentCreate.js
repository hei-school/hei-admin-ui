import {useState} from "react";
import {Create, Form, TextInput, useCreate} from "react-admin";
import {Box, IconButton, CircularProgress} from "@mui/material";
import {Send as SendIcon} from "@mui/icons-material";
import {v4 as uuid} from "uuid";
import {useForm} from "react-hook-form";

import {PALETTE_COLORS} from "../../ui/constants/palette";
import authProvider from "../../providers/authProvider";

function SaveCommentButton({}) {
  const [, {isLoading}] = useCreate();

  return isLoading ? (
    <CircularProgress size={35} sx={{marginTop: 1}} />
  ) : (
    <IconButton
      type="submit"
      sx={{marginTop: "10px", color: PALETTE_COLORS.primary}}
    >
      <SendIcon />
    </IconButton>
  );
}

export function CommentCreate({studentId, refetch}) {
  const observerId = authProvider.getCachedWhoami().id;
  const [commentContent, setCommentContent] = useState("");

  const reset = () => {
    refetch();
    setCommentContent("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Create
        resource="comments"
        title=" "
        redirect=""
        mutationOptions={{onSuccess: reset}}
        transform={(comment) => ({
          id: uuid(),
          student_id: studentId,
          observer_id: observerId,
          content: comment.content,
        })}
        sx={{
          "padding": 0,
          "boxShadow": "none",
          "width": "100%",
          "& #content-helper-text": {
            display: "none",
            padding: 0,
            margin: 0,
          },
          "& .MuiPaper-root": {
            boxShadow: "none",
          },
        }}
      >
        <Form>
          <Box sx={{display: "flex", alignItems: "start", gap: 2}}>
            <TextInput
              multiline
              fullWidth
              required
              variant="outlined"
              label="Commentaire"
              source="content"
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              size="small"
              sx={{
                minWidth: "170px",
                fontSize: "14px",
              }}
            />
            <SaveCommentButton />
          </Box>
        </Form>
      </Create>
    </Box>
  );
}
