import {FC, useMemo, useRef, useState} from "react";
import {
  FileField,
  FileInput,
  SimpleForm,
  TextInput,
  Confirm,
  useCreate,
  Toolbar,
  SaveButton,
} from "react-admin";

import {Dialog} from "@/ui/components";
import {CreateLettersDialogProps} from "@/operations/letters/types";
import {useNotify} from "@/hooks";
import {PALETTE_COLORS} from "@/haTheme";
import {v4 as uuid} from "uuid";
import uploadImg from "@/assets/file_upload.png";

const FILE_FIELD_STYLE = {
  "border": "1px dashed",
  "borderColor": PALETTE_COLORS.grey,
  "borderRadius": "8px",
  "backgroundColor": PALETTE_COLORS.lightgrey,
  "height": "14vh",
  "backgroundImage": `url(${uploadImg})`,
  "backgroundRepeat": "no-repeat",
  "backgroundPosition": "center",
  "backgroundPositionY": "1.5vh",
  "backgroundSize": "20%",
  "position": "relative",
  "& .RaFileInput-dropZone": {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: "0",
    width: "97%",
    cursor: "pointer",
    height: "14vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
  },
};

const CustomToolbar: React.FC<{handleSave: () => void}> = ({handleSave}) => (
  <Toolbar>
    <SaveButton label="Enregistrer" onClick={handleSave} />
  </Toolbar>
);

export const CreateLettersDialog: FC<CreateLettersDialogProps> = ({
  isOpen,
  onClose,
  studentId,
  feeId,
  feeAmount,
  title,
  eventParticipantId,
}) => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const letterRef = useRef<any>(null);
  const [create] = useCreate();

  const handleConfirm = () => {
    if (letterRef.current) {
      create(
        "student-letters",
        {
          data: letterRef.current,
          meta: {studentId, feeId, feeAmount, eventParticipantId},
        },
        {
          onSuccess: () => {
            notify("Lettre créée avec succès", {type: "success"});
            onClose();
          },
          onError: () => {
            notify("Erreur lors de la création de la lettre", {type: "error"});
          },
        }
      );
    }
    setConfirmOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={title ?? "Ajouter une lettre"}
      data-testid="add-letter"
    >
      <SimpleForm
        toolbar={
          <CustomToolbar
            handleSave={() => {
              setConfirmOpen(true);
            }}
          />
        }
        values={useMemo(
          () => ({
            id: uuid(),
            description: "",
            filename: {},
          }),
          []
        )}
        onSubmit={(letter) => {
          letterRef.current = letter;
          setConfirmOpen(true);
        }}
      >
        <TextInput
          source="description"
          label="Description"
          required
          sx={{
            width: "100%",
          }}
        />
        <FileInput
          isRequired
          resource="student-letters"
          source="filename"
          label=" "
          multiple={false}
          accept="application/pdf"
          sx={FILE_FIELD_STYLE}
        >
          <FileField
            resource="student-letters"
            source="filename"
            title="title"
          />
        </FileInput>
      </SimpleForm>

      <Confirm
        isOpen={confirmOpen}
        title="Confirmation"
        content="Êtes-vous sûr de vouloir créer cette lettre ?"
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </Dialog>
  );
};
