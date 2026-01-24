import ExcelIcon from "@/assets/xls.png";
import {useNotify, useToggle} from "@/hooks";
import {FileDownloader} from "@/operations/common/components";
import {FileUploadDialog} from "@/operations/common/components/FileUploadDialog";
import {useRole} from "@/security/hooks";
import {Download, Upload} from "@mui/icons-material";
import {IMPORT_CHOICES} from "../utils";
import {ImportResultDialog} from "./ImportResultDialog";

import {Box} from "@mui/material";
import {useState} from "react";
import {
  Button,
  FormDataConsumer,
  SelectInput,
  TextInput,
  useDataProvider,
  useRefresh,
} from "react-admin";

export const ExamGradeListActions = ({examId, examName}) => {
  const {isManager, isAdmin, isTeacher} = useRole();
  const [isOpen, , toggle] = useToggle();
  const hasPermission = isManager() || isAdmin() || isTeacher();
  const notify = useNotify();
  const refresh = useRefresh();
  const [importResult, setImportResult] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const dataProvider = useDataProvider();

  const downloadFile = async () => {
    try {
      const {data} = await dataProvider.getOne("import-grades", {
        meta: {examId},
      });
      if (!data) {
        notify("Aucun modèle à télécharger !!!");
        return;
      } else {
        return data;
      }
    } catch (error) {
      notify("Error lors du téléchargement !!!");
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          startIcon={<Upload />}
          onClick={toggle}
          label="Importer"
          sx={{
            textTransform: "none",
            fontSize: "1.1rem",
            color: "inherit",
            opacity: "0.8",
            padding: "0.7rem 1.1rem",
            gap: "0.4rem",
            width: "80%",
          }}
        />

        <FileUploadDialog
          isOpen={isOpen}
          onClose={toggle}
          title="Importer les notes"
          resource="import-grades"
          accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          fileIcon={ExcelIcon}
          fileIconAlt="Excel"
          saveButtonLabel="Lancer l'import"
          confirmContent="Êtes-vous certain de vouloir lancer l'import avec le fichier sélectionné ?"
          meta={{examId}}
          onSubmitSuccess={(response) => {
            setImportResult(response);
            setIsResultOpen(true);
          }}
        >
          <SelectInput
            source="mode"
            label="Type d'import"
            choices={IMPORT_CHOICES}
            optionValue="id"
            optionText="name"
            fullWidth
            required
            emptyText="--Type d'import--"
          />
          <FormDataConsumer>
            {({formData}) =>
              formData.mode === "UPDATE" && (
                <TextInput
                  source="comment"
                  label="Commentaire"
                  fullWidth
                  required
                  multiline
                  rows={1}
                  sx={{
                    "& .MuiInputBase-root": {
                      minHeight: "120px",
                      alignItems: "flex-start",
                    },
                    "& textarea": {
                      resize: "vertical",
                      minHeight: "100px",
                    },
                  }}
                />
              )
            }
          </FormDataConsumer>
        </FileUploadDialog>

        <FileDownloader
          downloadFunction={downloadFile}
          sx={{
            fontSize: "1rem",
            textTransform: "none",
            color: "inherit",
            opacity: "0.8",
            padding: "0.5rem 1.1rem",
            gap: "0.8rem",
          }}
          startIcon={<Download />}
          fileName="Liste des notes"
          buttonText="Modèle"
          successMessage="Téléchargement en cours..."
          errorMessage="Erreur lors du téléchargement du fichier."
          fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </Box>

      <ImportResultDialog
        open={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        importResult={importResult}
      />
    </>
  );
};
