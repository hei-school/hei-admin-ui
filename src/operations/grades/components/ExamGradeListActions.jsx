import ExcelIcon from "@/assets/xls.png";
import {useNotify, useToggle} from "@/hooks";
import {FileUploadDialog} from "@/operations/common/components/FileUploadDialog";
import {useRole} from "@/security/hooks";
import {ButtonBase} from "@/ui/haToolbar";
import {NOOP_ID} from "@/utils/constants";
import {Download, Upload} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {
  Button,
  FormDataConsumer,
  SelectInput,
  TextInput,
  useGetOne,
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
  const importChoices = [
    {id: "IMPORT", name: "Nouvelles notes"},
    {id: "UPDATE", name: "Mettre à jours les notes"},
  ];
  const {refetch, isFetching} = useGetOne(
    "import-grades",
    {id: NOOP_ID, meta: {examId}},
    {
      enabled: false,
      onSuccess: (data) => {
        if (data?.data) {
          const blob = new Blob([data.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `template_${examId}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          notify("URL du template non trouvée", {type: "warning"});
        }
      },
    }
  );

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          startIcon={<Upload />}
          onClick={toggle}
          label="Importer"
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            gap: "7px",
            padding: "7px 8px 7px 15px",
            minWidth: 0,
            textTransform: "none",
            color: "#474645",
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
            choices={importChoices}
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
        <ButtonBase
          startIcon={<Download />}
          onClick={() => refetch()}
          disabled={isFetching}
          closeAction={false}
        >
          {isFetching ? "Téléchargement..." : "Modèle"}
        </ButtonBase>
      </Box>
      {importResult?.importGradeStats?.invalidRows > 0 && (
        <Dialog
          open={isResultOpen}
          onClose={() => setIsResultOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{bgcolor: "#001948", color: "white", fontSize: "18px"}}
          >
            Les import invalides
            <IconButton
              onClick={() => setIsResultOpen(false)}
              sx={{position: "absolute", right: 8, top: 8, color: "white"}}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{mt: 2}}>
            <Alert severity="warning" sx={{mb: 2}}>
              <AlertTitle>Attention</AlertTitle>
              {importResult.importGradeStats.invalidRows} ligne(s) invalide(s)
              sur {importResult.importGradeStats.totalRows}
            </Alert>

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Référence</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Note</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Erreur</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importResult.invalidGrades.map((grade, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{grade.ref}</TableCell>
                      <TableCell>{grade.score ?? "-"}</TableCell>
                      <TableCell sx={{color: "error.main"}}>
                        {grade.reason}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography
              variant="caption"
              sx={{display: "block", mt: 2, color: "text.secondary"}}
            >
              {importResult.importGradeStats.validRows} ligne(s) valide(s) ont
              été importées avec succès.
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
