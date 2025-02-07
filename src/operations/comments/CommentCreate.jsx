import {Add as AddIcon} from "@mui/icons-material";
import {Box, Button, Dialog} from "@mui/material";
import {Create, SimpleForm, TextInput} from "react-admin";
import {v4 as uuid} from "uuid";

import {useToggle} from "../../hooks";
import authProvider from "../../providers/authProvider";

const CREATE_WRAPPER_STYLE = {
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  width: "100%",
};

export function CommentCreate({studentId, refetchList}) {
  const [showCreate, , toggleShowCreate] = useToggle(false);
  const observerId = authProvider.getCachedWhoami().id;

  const resetCreate = () => {
    refetchList();
    toggleShowCreate();
  };

  return (
    <Box sx={CREATE_WRAPPER_STYLE}>
      <Button
        sx={{mt: 1, fontWeight: "bold"}}
        startIcon={<AddIcon />}
        onClick={toggleShowCreate}
      >
        Ajouter
      </Button>
      <Dialog
        open={showCreate}
        onClose={toggleShowCreate}
        sx={{
          "zIndex": 99999,
          "& .MuiDialog-paper": {
            overflowX: "hidden",
          },
        }}
      >
        <Create
          resource="comments"
          title=" "
          redirect=""
          mutationOptions={{onSuccess: resetCreate}}
          transform={(comment) => ({
            id: uuid(),
            student_id: studentId,
            observer_id: observerId,
            content: comment.content,
          })}
          sx={{
            "& .MuiPaper-root": {
              minWidth: "750px",
            },
          }}
        >
          <SimpleForm>
            <TextInput
              multiline
              required
              autoFocus
              variant="outlined"
              label="Commentaire"
              source="content"
              size="small"
              sx={{width: "74%"}}
            />
          </SimpleForm>
        </Create>
      </Dialog>
    </Box>
  );
}
