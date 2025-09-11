import {Dialog} from "@/ui/components";
import {
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  maxValue,
  minValue,
  number,
  required,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";

interface GradeEditFormProps {
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
  isEditing: boolean;
  initialComment?: string | undefined;
}

const GradeForm = () => {
  const record = useRecordContext();
  const hasScore = record?.grade?.score !== undefined;

  return (
    <>
      <NumberInput
        source="grade.score"
        label="Note"
        fullWidth
        validate={[required(), number(), minValue(0), maxValue(20)]}
        helperText="Note sur 20"
      />
      <TextInput
        source="comment"
        label="Commentaire"
        fullWidth
        multiline
        rows={3}
        validate={hasScore ? [required()] : []}
        helperText={hasScore ? "Requis lorsque une note est attribuée" : ""}
      />
    </>
  );
};

export const GradeEditForm = ({
  onSubmit,
  isLoading,
  onClose,
  isEditing,
  initialComment,
}: GradeEditFormProps) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const handleSubmit = async (values: any) => {
    try {
      if (values.grade?.score !== undefined && !values.comment) {
        notify(
          "Un commentaire est obligatoire lorsque une note est attribuée",
          {type: "warning"}
        );
        return;
      }

      await onSubmit(values);
      notify("Note enregistrée avec succès", {type: "success"});
      refresh();
      onClose();
    } catch (error) {
      console.error("Error saving grade:", error);
      notify("Erreur lors de l'enregistrement de la note", {type: "error"});
    }
  };

  return (
    <Dialog
      title={isEditing ? "Modifier la note" : "Attribuer une note"}
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <SimpleForm
        onSubmit={handleSubmit}
        defaultValues={{
          grade: {score: undefined},
          comment: initialComment || "",
        }}
        toolbar={
          <Toolbar>
            <SaveButton disabled={isLoading} label="Enregistrer" />
          </Toolbar>
        }
      >
        <GradeForm />
      </SimpleForm>
    </Dialog>
  );
};
