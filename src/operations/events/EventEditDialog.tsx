import {useNotify} from "@/hooks";
import {Box, Button} from "@mui/material";
import {
  DateTimeInput,
  Edit,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import {FC} from "react";
import {Dialog} from "@/ui/components";

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
              <DateTimeInput
                label="Début"
                source="begin_datetime"
                fullWidth
                validate={required()}
              />
              <DateTimeInput
                label="Fin"
                source="end_datetime"
                fullWidth
                validate={required()}
              />
            </Box>
          </SimpleForm>
        </Edit>
      </Dialog>
    </>
  );
};
