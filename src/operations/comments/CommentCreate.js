import { Box, IconButton } from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"
import { Create, Form, TextInput } from "react-admin"

export function CommentCreate() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <Create
        resource="students"
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
              variant="outlined"
              label="Commentaire"
              source="content"
              size="small"
              fullWidth
              sx={{
                minWidth: "170px", fontSize: "14px"
              }}
            />
            <IconButton sx={{marginTop: "10px"}}>
              <SendIcon />
            </IconButton>
          </Box>
        </Form>
      </Create>
    </Box>
  )
}
