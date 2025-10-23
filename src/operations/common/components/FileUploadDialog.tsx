import uploadImg from "@/assets/file_upload.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {Dialog} from "@/ui/components";
import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";
import {FC, ReactNode, useMemo, useRef, useState} from "react";
import {
  Confirm,
  FileField,
  FileInput,
  SaveButton,
  SimpleForm,
  Toolbar,
  useCreate,
} from "react-admin";
import {v4 as uuid} from "uuid";

export interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  resource: string;
  accept?: string;
  maxSize?: number;
  onSubmitSuccess?: () => void;
  onSubmitError?: () => void;
  meta?: Record<string, any>;
  children?: ReactNode;
  fileIcon?: string;
  fileIconAlt?: string;
  confirmContent?: string;
  saveButtonLabel?: string;
  validateFile?: (file: File) => Promise<{
    isValid: boolean;
    errorMessage?: string;
    additionalInfo?: any;
  }>;
}

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

const CustomToolbar: FC<{
  handleSave: () => void;
  isLoading: boolean;
  saveButtonLabel?: string;
  isFileValid: boolean;
}> = ({
  handleSave,
  isLoading,
  saveButtonLabel = "Enregistrer",
  isFileValid,
}) => (
  <Toolbar>
    <SaveButton
      label={saveButtonLabel}
      disabled={isLoading || !isFileValid}
      onClick={handleSave}
    />
  </Toolbar>
);

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Ko";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} Ko`;
  return `${(kb / 1024).toFixed(2)} Mo`;
};

export const FileUploadDialog: FC<FileUploadDialogProps> = ({
  isOpen,
  onClose,
  title,
  resource,
  accept = "application/pdf",
  maxSize = 5_000_000,
  onSubmitSuccess,
  onSubmitError,
  meta,
  children,
  fileIcon,
  fileIconAlt = "Fichier",
  confirmContent = "Êtes-vous certain de vouloir procéder ?",
  saveButtonLabel = "Enregistrer",
  validateFile,
}) => {
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<any>(null);
  const [create, {isLoading}] = useCreate();
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    additionalInfo?: any;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isFileValid, setIsFileValid] = useState(false);

  const handleFileChange = async (file?: File | null) => {
    setFileError(null);
    setIsFileValid(false);

    if (!file) {
      setFileInfo(null);
      return;
    }

    if (file.size > maxSize) {
      setFileError(
        `La taille maximale autorisée pour le fichier est de ${formatFileSize(maxSize)}.`
      );
      setFileInfo(null);
      return;
    }

    if (validateFile) {
      try {
        const validation = await validateFile(file);
        if (!validation.isValid) {
          setFileError(validation.errorMessage || "Fichier invalide");
          setFileInfo(null);
          setIsFileValid(false);
          return;
        }
        setFileInfo({
          name: file.name,
          size: file.size,
          additionalInfo: validation.additionalInfo,
        });
        setIsFileValid(true);
      } catch (error) {
        setFileError("Erreur lors de la validation du fichier");
        setFileInfo(null);
        setIsFileValid(false);
        return;
      }
    } else {
      setFileInfo({name: file.name, size: file.size});
      setIsFileValid(true);
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);

    if (!formRef.current) {
      notify("Veuillez remplir le formulaire avant de valider", {
        type: "warning",
      });
      return;
    }

    if (!isFileValid) {
      notify("Veuillez fournir un fichier valide avant de valider", {
        type: "warning",
      });
      return;
    }

    create(
      resource,
      {
        data: formRef?.current!,
        meta,
      },
      {
        onSuccess: () => {
          notify("Opération effectuée avec succès", {type: "success"});
          setFileInfo(null);
          setFileError(null);
          setIsFileValid(false);
          onSubmitSuccess?.();
          onClose();
        },
        onError: () => {
          notify("Erreur lors de l'opération", {type: "error"});
          onSubmitError?.();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title={title}>
      {isLoading && (
        <Backdrop sx={{zIndex: 10}} open={isOpen}>
          <CircularProgress sx={{color: "white"}} />
        </Backdrop>
      )}

      <SimpleForm
        toolbar={
          <CustomToolbar
            handleSave={() => setConfirmOpen(true)}
            isLoading={isLoading}
            saveButtonLabel={saveButtonLabel}
            isFileValid={isFileValid}
          />
        }
        values={useMemo(() => ({id: uuid()}), [])}
        onSubmit={(formData) => {
          formRef.current = formData;
          setConfirmOpen(true);
        }}
      >
        {children}

        <FileInput
          data-testid="file-input"
          isRequired
          resource={resource}
          source="file"
          label=" "
          multiple={false}
          accept={accept}
          sx={FILE_FIELD_STYLE}
          maxSize={maxSize}
          options={{
            onDropRejected: () => {
              setFileError(
                `La taille maximale autorisée pour le fichier est de ${formatFileSize(maxSize)}.`
              );
              setIsFileValid(false);
            },
          }}
          onChange={(data: any) => {
            const fileObj: File | null =
              data && data instanceof File
                ? data
                : Array.isArray(data) && data.length
                  ? data[0]
                  : null;
            handleFileChange(fileObj);
          }}
        >
          <FileField source="src" title="title" />
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
            {fileIcon && (
              <img
                src={fileIcon}
                alt={fileIconAlt}
                style={{height: "40px", width: "40px"}}
              />
            )}
            <Box width="100%">
              <Typography variant="body1" sx={{fontWeight: "medium"}}>
                {fileInfo.name}
              </Typography>
              <Typography variant="body2" color="grey">
                {formatFileSize(fileInfo.size)}
                {fileInfo.additionalInfo?.rowsCount &&
                  ` - ${fileInfo.additionalInfo.rowsCount} lignes`}
              </Typography>
            </Box>
          </Box>
        )}

        {fileError && (
          <Typography variant="subtitle1" color="red">
            {fileError}
          </Typography>
        )}

        {!isFileValid && fileInfo === null && (
          <Typography variant="body2" color="grey" sx={{mt: 1}}>
            Veuillez sélectionner un fichier valide pour activer
            l'enregistrement
          </Typography>
        )}
      </SimpleForm>

      <Confirm
        isOpen={confirmOpen}
        title="Confirmation"
        content={confirmContent}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </Dialog>
  );
};
