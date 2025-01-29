import {useNotify} from "@/hooks";
import {DateTimeField} from "@/operations/common/components/fields";
import {Dialog} from "@/ui/components";
import {Box} from "@mui/material";
import {FC} from "react";
import {
  Edit,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import {SelectClassroom} from "./components/SelectClassrroom";

interface EditProps {
  eventId: string;
  editShow: boolean;
  toggleEdit: () => void;
}

export const EventEditDialog: FC<EditProps> = ({
  eventId,
  editShow,
  toggleEdit,
}) => {
  const notify = useNotify();

  return (
    <>
      <Dialog title="Edition d'événement" open={editShow} onClose={toggleEdit}>
        <Edit
          title=" "
          id={eventId}
          resource="events"
          mutationMode="pessimistic"
          mutationOptions={{
            onSuccess: () => {
              notify("Événement mis à jour.", {type: "success"});
              toggleEdit();
            },
          }}
          transform={(input: {[key: string]: any}) => ({
            ...input,
            course_id: input.course?.id,
            planner_id: input.planner.id,
            event_type: input.type,
          })}
        >
          <SimpleForm
            toolbar={
              <Toolbar>
                <SaveButton data-testid="edit-button" />
              </Toolbar>
            }
          >
            <SelectClassroom />
            <TextInput
              label="Description"
              source="description"
              multiline
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <DateTimeField
                source="begin_datetime"
                label="Fin"
                validate={required()}
              />
              <DateTimeField
                source="end_datetime"
                label="Fin"
                validate={required()}
              />
            </Box>
          </SimpleForm>
        </Edit>
      </Dialog>
    </>
  );
};
