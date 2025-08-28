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
} from "react-admin";

interface GradeEditFormProps {
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
  isEditing: boolean;
  initialComment?: string | undefined;
}

export const GradeEditForm = ({
  onSubmit,
  isLoading,
  onClose,
  isEditing,
  initialComment,
}: GradeEditFormProps) => (
  <Dialog
    title={isEditing ? "Modifier la note" : "Attribuer une note"}
    open
    onClose={onClose}
    fullWidth
    maxWidth="sm"
  >
    <SimpleForm
      onSubmit={onSubmit}
      defaultValues={
        isEditing ? {grade: {score: undefined}, comment: initialComment} : {}
      }
      toolbar={
        <Toolbar>
          <SaveButton disabled={isLoading} label="Enregistrer" />
        </Toolbar>
      }
    >
      <NumberInput
        source="grade.score"
        label="Note"
        fullWidth
        validate={[required(), number(), minValue(0), maxValue(20)]}
      />
      {isEditing && (
        <TextInput source="comment" label="Commentaire" fullWidth multiline />
      )}
    </SimpleForm>
  </Dialog>
);
