import {FC} from "react";
import {FileField, FileInput, SimpleForm, TextInput} from "react-admin";
import {Dialog} from "@/ui/components";
import {PALETTE_COLORS} from "@/haTheme";
import uploadImg from "@/assets/file_upload.png";
import {Letter} from "@haapi/typescript-client";
import {v4 as uuid} from "uuid";
import {Create} from "@/operations/common/components";
import {CreateLettersDialogProps} from "@/operations/letters/types";
import {useNotify} from "@/hooks";

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

export const CreateLettersDialog: FC<CreateLettersDialogProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const notify = useNotify();

  return (
    <Dialog open={isOpen} onClose={onClose} title="Ajouter une lettre">
      <Create
        title=" "
        transform={(letter: Letter) => ({
          ...letter,
          id: uuid(),
        })}
        redirect={false}
        resource="student-letters"
        mutationOptions={{
          meta: {
            method: "CREATE",
            studentId,
          },
          onSuccess: () => {
            notify("Créé avec succès", {
              type: "success",
            });
            onClose();
          },
        }}
        sx={{
          width: "100%",
        }}
      >
        <SimpleForm>
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
      </Create>
    </Dialog>
  );
};
