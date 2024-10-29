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
import {Box, Typography} from "@mui/material";
import {Dialog} from "@/ui/components";
import {CreateLettersDialogProps} from "@/operations/letters/types";
import {useNotify} from "@/hooks";
import {PALETTE_COLORS} from "@/haTheme";
import {v4 as uuid} from "uuid";
import uploadImg from "@/assets/file_upload.png";
import PdfIcon from "@/assets/pdf.png";

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
  const [fileInfo, setFileInfo] = useState<{name: string; size: number} | null>(
    null
  );
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);

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
            setFileInfo(null);
            onClose();
          },
          onError: () => {
            setFileInfo(null);
            notify("Erreur lors de la création de la lettre", {type: "error"});
          },
        }
      );
    }
    setConfirmOpen(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Ko";
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} Ko`;
    }
    return `${(kb / 1024).toFixed(2)} Mo`;
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
          maxSize={5_000_000}
          options={{
            onDropRejected() {
              setIsFileTooLarge(true);
            },
          }}
          onChange={(data) => {
            setIsFileTooLarge(false);
            if (data) {
              setFileInfo({
                name: data.name,
                size: data.size,
              });
            } else {
              setFileInfo(null);
            }
          }}
        >
          <FileField
            resource="student-letters"
            source="filename"
            title="title"
          />
        </FileInput>
        {fileInfo && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              paddingBlock: "8px",
              paddingLeft: "6px",
              backgroundColor: PALETTE_COLORS.lightgrey,
              borderRadius: "4px",
              width: "100%",
            }}
          >
            <img
              src={PdfIcon}
              alt="PDF"
              style={{
                height: "40px",
                width: "40px",
              }}
            />
            <Box width="100%">
              <Typography variant="body1" sx={{fontWeight: "medium"}}>
                {fileInfo.name}
              </Typography>
              <Typography variant="body2" color="grey">
                {formatFileSize(fileInfo.size)}
              </Typography>
            </Box>
          </Box>
        )}
        {isFileTooLarge && (
          <Typography variant="subtitle1" color="red">
            La taille maximale du fichier est de 5 Mo.
          </Typography>
        )}
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
