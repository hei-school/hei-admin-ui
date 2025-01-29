import {useNotify, useToggle} from "@/hooks";
import {Edit} from "@/operations/common/components";
import {Dialog} from "@/ui/components";
import {Course} from "@haapi/typescript-client";
import {Create as EditIcon} from "@mui/icons-material";
import {
  Button,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  minValue,
  number,
  required,
  useRecordContext,
} from "react-admin";

export function CourseEditButton() {
  const {id} = useRecordContext();
  const [showEdit, _set, toggleEdit] = useToggle();
  const notify = useNotify();

  return (
    <>
      <Button
        onClick={toggleEdit}
        startIcon={<EditIcon />}
        label="EDITER"
        data-testid="edit-button"
        variant="text"
        sx={{py: "5px"}}
      />
      <Dialog
        title="Modification d'un cours"
        open={showEdit}
        onClose={toggleEdit}
      >
        <Edit
          id={id}
          title=" "
          actions={false}
          redirect={false}
          resource="course"
          transform={(course: Course): Course => ({
            ...course,
            total_hours: +course.total_hours!,
            credits: +course.credits!,
          })}
          mutationOptions={{
            onSuccess: () => {
              notify("Cours mis à jour");
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
            <TextInput
              source="code"
              label="Code"
              validate={required()}
              fullWidth
            />
            <TextInput
              source="name"
              label="Nom"
              validate={required()}
              fullWidth
            />
            <TextInput
              source="credits"
              label="Crédits"
              validate={[required(), number(), minValue(1)]}
              fullWidth
            />
            <TextInput
              source="total_hours"
              label="Heure total"
              validate={[required(), number(), minValue(1)]}
              fullWidth
            />
          </SimpleForm>
        </Edit>
      </Dialog>
    </>
  );
}
