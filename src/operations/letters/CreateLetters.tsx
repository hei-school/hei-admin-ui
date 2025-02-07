import uploadImg from "@/assets/file_upload.png";
import PdfIcon from "@/assets/pdf.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {CreateLettersDialogProps} from "@/operations/letters/types";
import {Dialog} from "@/ui/components";
import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";
import {FC, useMemo, useRef, useState} from "react";
import {
  Confirm,
  FileField,
  FileInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useCreate,
} from "react-admin";
import {v4 as uuid} from "uuid";

export const FILE_FIELD_STYLE = {
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

const CustomToolbar: React.FC<{handleSave: () => void; isloading: boolean}> = ({
  handleSave,
  isloading,
}) => (
  <Toolbar>
    <SaveButton label="Enregistrer" disabled={isloading} onClick={handleSave} />
  </Toolbar>
);

export const CreateLettersDialog: FC<CreateLettersDialogProps> = ({
  isOpen,
  onClose,
  userId,
  feeId,
  feeAmount,
  title,
  eventParticipantId,
}) => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const letterRef = useRef<any>(null);
  const [create, {isLoading}] = useCreate();
  const [fileInfo, setFileInfo] = useState<{name: string; size: number} | null>(
    null
  );
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (letterRef.current) {
      create(
        "users-letters",
        {
          data: letterRef.current,
          meta: {userId, feeId, feeAmount, eventParticipantId},
        },
        {
          onSuccess: () => {
            notify("Lettre créée avec succès", {type: "success"});
            setFileInfo(null);
            onClose();
          },
          onError: () => {
            setFileInfo(null);
            notify("Erreur lors de la création de la lettre", {
              type: "error",
            });
          },
        }
      );
    }
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
      {isLoading && (
        <Backdrop sx={{zIndex: 10}} open={isOpen}>
          <CircularProgress
            sx={{
              color: "white",
            }}
          />
        </Backdrop>
      )}
      ;
      <SimpleForm
        toolbar={
          <CustomToolbar
            handleSave={() => {
              setConfirmOpen(true);
            }}
            isloading={isLoading}
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
          resource="users-letters"
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
          <FileField resource="users-letters" source="filename" title="title" />
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
