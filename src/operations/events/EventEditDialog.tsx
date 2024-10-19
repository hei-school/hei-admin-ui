import {useNotify} from "@/hooks";
import {Box, Button} from "@mui/material";
import {
  Edit,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import {FC} from "react";
import {Dialog} from "@/ui/components";
import {DateTimeField} from "@/operations/common/components/fields";

interface EditProps {
  eventId: string;
  toggle: () => void;
  open: boolean;
}

export const EventEditDialog: FC<EditProps> = ({eventId, open, toggle}) => {
  const notify = useNotify();
  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={toggle}
        sx={{textTransform: "revert"}}
      >
        Editer
      </Button>
      <Dialog title="Edition d'événement" open={open} onClose={toggle}>
        <Edit
          title=" "
          id={eventId}
          actions={false}
          redirect={false}
          resource="events"
          mutationOptions={{
            onSuccess: () => {
              notify("Événement mis à jour.");
              toggle();
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
              label="Titre"
              source="title"
              fullWidth
              validate={required()}
            />
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
