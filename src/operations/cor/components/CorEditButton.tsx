import {useNotify, useToggle} from "@/hooks";
import {Edit} from "@/operations/common/components";
import {Dialog} from "@/ui/components";
import {Cor} from "@haapi-b0fc7615/typescript-client";
import {Edit as EditIcon} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import {
  DateTimeInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
} from "react-admin";

export const CorEditButton = () => {
  const [showEdit, _set, toggleEdit] = useToggle();
  const {id} = useRecordContext();
  const notify = useNotify();

  return (
    <>
      <Tooltip
        title="Éditer"
        onClick={toggleEdit}
        sx={{cursor: "pointer", mx: 1}}
      >
        <IconButton size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog title="Éditer le COR" open={showEdit} onClose={toggleEdit}>
        <Edit
          id={id}
          title=" "
          queryOptions={{
            meta: {id: id},
          }}
          actions={false}
          resource="cor"
          redirect={false}
          transform={(cor: Cor) => ({
            ...cor,
            description: cor.description,
            interview_date: cor.interview_date,
            concerned_student_id: cor.concerned_student?.id!,
          })}
          mutationOptions={{
            onSuccess: () => {
              notify("COR modifié avec succès");
              toggleEdit();
            },
          }}
        >
          <SimpleForm
            toolbar={
              <Toolbar>
                <SaveButton data-testid="edit-button" />
              </Toolbar>
            }
          >
            <TextInput source="description" label="Déscription" fullWidth />
            <DateTimeInput
              source="interview_date"
              label="Date d'entretien"
              fullWidth
            />
          </SimpleForm>
        </Edit>
      </Dialog>
    </>
  );
};
