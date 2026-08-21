import {useNotify, useToggle} from "@/hooks";
import {Create} from "@/operations/common/components";
import {Dialog} from "@/ui/components";
import {CorCommentInfo} from "@haapi-3d601c85/typescript-client";
import {Add, AddComment} from "@mui/icons-material";
import {Box, IconButton, Tooltip} from "@mui/material";
import {FC} from "react";
import {
  Button,
  required,
  SimpleForm,
  TextInput,
  useRecordContext,
} from "react-admin";

export const AddCorComment: FC<{islist?: boolean}> = ({islist}) => {
  const [showAddComment, _set, toggleAddComment] = useToggle();
  const {id: corId} = useRecordContext();
  const notify = useNotify();

  return (
    <Box>
      {islist ? (
        <Tooltip
          title="Ajouter un commentaire"
          onClick={toggleAddComment}
          data-testid="add-cor-comment"
        >
          <IconButton>
            <AddComment />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          onClick={toggleAddComment}
          label="Ajouter"
          variant="contained"
          sx={{
            padding: "10px",
          }}
          endIcon={<Add />}
        />
      )}
      <Dialog
        title="Ajouter un commentaire"
        open={showAddComment}
        onClose={toggleAddComment}
      >
        <Create
          title=" "
          transform={(
            comment: CorCommentInfo
          ): CorCommentInfo & {id: string} => ({
            ...comment,
            id: corId as string,
          })}
          resource="student-cor"
          mutationOptions={{
            onSuccess: () => {
              notify("Commentaire ajouté avec succès");
              toggleAddComment();
            },
          }}
        >
          <SimpleForm>
            <TextInput
              source="comment"
              label="Commentaire"
              fullWidth
              validate={required()}
            />
          </SimpleForm>
        </Create>
      </Dialog>
    </Box>
  );
};
