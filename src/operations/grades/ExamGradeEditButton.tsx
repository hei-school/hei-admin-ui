import {useNotify, useToggle} from "@/hooks";
import {Edit} from "@/operations/common/components";
import {Dialog} from "@/ui/components";
import {Create as EditIcon} from "@mui/icons-material";
import {
  Button,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useRecordContext,
} from "react-admin";

export const ExamGradeEditButton = () => {
  const {id} = useRecordContext();
  const [showEdit, _set, toggleEdit] = useToggle();
  const notify = useNotify();

  return (
    <>
      <Button
        onClick={toggleEdit}
        startIcon={<EditIcon />}
        label="MODIFIER NOTE"
        variant="text"
        sx={{py: "5px"}}
      />
      <Dialog
        title="Modification d'une note"
        open={showEdit}
        onClose={toggleEdit}
      >
        <Edit
          id={id}
          title=" "
          actions={false}
          redirect={false}
          transform={(grade: any) => ({
            ...grade,
            score: +grade.score!,
          })}
          mutationOptions={{
            onSuccess: () => {
              notify("Note mis à jour");
              toggleEdit();
            },
          }}
        >
          <SimpleForm
            toolbar={
              <Toolbar>
                <SaveButton />
              </Toolbar>
            }
          >
            <TextInput
              source="id"
              label="ID de l'étudiant"
              defaultValue={id}
              disabled
              fullWidth
            />
            <TextInput
              source="score"
              label="Note"
              validate={required()}
              fullWidth
            />
          </SimpleForm>
        </Edit>
      </Dialog>
    </>
  );
};
