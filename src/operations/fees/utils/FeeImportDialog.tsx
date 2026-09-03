import {useNotify} from "@/hooks";
import {Create} from "@/operations/common/components";
import {FILE_FIELD_STYLE} from "@/operations/letters/CreateLetters";
import {Dialog} from "@/ui/components";
import {useMediaQuery} from "@mui/material";
import {useState} from "react";
import {FileField, FileInput, SimpleForm, useRefresh} from "react-admin";
import {v4 as uuid} from "uuid";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ImportDialog = ({open, onClose}: Props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [fileUploaded, setFileUploaded] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title="Importer les transactions venant de Orange Money (sous format excel)"
      maxWidth={isMobile ? "sm" : "md"}
      fullWidth
    >
      <Create
        title=" "
        redirect={false}
        resource="mpbs-verify"
        mutationOptions={{
          onSuccess: () => {
            notify("Transactions importées.", {type: "success"});
            onClose();
            refresh();
          },
        }}
        transform={(mpbsFile: File) => ({id: uuid(), ...mpbsFile})}
      >
        <SimpleForm
          onSubmit={fileUploaded ? undefined : () => {}}
          disabled={!fileUploaded}
        >
          <FileInput
            source="mpbsFile"
            label=" "
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            sx={FILE_FIELD_STYLE}
            options={{
              onDropAccepted: () => setFileUploaded(true),
              onDropRejected: () => {
                setFileUploaded(false);
                notify(
                  "Mauvais format de fichier. Seuls les fichiers .xls et .xlsx sont acceptés.",
                  {type: "warning"}
                );
              },
            }}
          >
            <FileField source="src" title="title" />
          </FileInput>
        </SimpleForm>
      </Create>
    </Dialog>
  );
};
