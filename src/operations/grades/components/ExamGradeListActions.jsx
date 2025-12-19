import ExcelIcon from "@/assets/xls.png";
import {useNotify, useToggle} from "@/hooks";
import {FileUploadDialog} from "@/operations/common/components/FileUploadDialog";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import examGradeProvider from "@/providers/examGradeProvider";
import {useRole} from "@/security/hooks";
import {ButtonBase} from "@/ui/haToolbar";
import {Download, Upload} from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {
  Button,
  FormDataConsumer,
  SelectInput,
  TextInput,
  useGetList,
  useRefresh,
} from "react-admin";
import * as XLSX from "xlsx";

export const ExamGradeListActions = ({examId, examName}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    message: "",
  });
  const [participants, setParticipants] = useState([]);
  const {isManager, isAdmin, isTeacher} = useRole();

  const [isOpen, , toggle] = useToggle();
  const hasPermission = isManager() || isAdmin() || isTeacher();
  const notify = useNotify();
  const refresh = useRefresh();
  const [importResult, setImportResult] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const {data: participantsData} = useGetList("exam-grades", {
    pagination: {page: 1, perPage: MAX_ITEM_PER_PAGE},
    meta: {examId},
  });

  const importChoices = [
    {id: "IMPORT", name: "Nouvelles notes"},
    {id: "UPDATE", name: "Mettre à jours les notes"},
  ];

  useEffect(() => {
    if (participantsData && participantsData.length > 0) {
      setParticipants(participantsData);
    } else if (examId) {
      examGradeProvider
        .getList(1, MAX_ITEM_PER_PAGE, {}, {examId})
        .then((result) => {
          if (result.data && result.data.length > 0) {
            setParticipants(result.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching participants:", err);
        });
    }
  }, [participantsData, examId]);

  if (!hasPermission) return null;

  const downloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      notify("Téléchargement du modèle en cours...", {
        type: "info",
        autoHideDuration: 100000,
      });

      let currentParticipants = participants;

      if (!currentParticipants || currentParticipants.length === 0) {
        try {
          const result = await examGradeProvider.getList(
            1,
            MAX_ITEM_PER_PAGE,
            {},
            {examId}
          );
          currentParticipants = result.data || [];
        } catch (error) {
          console.error("Error fetching participants for template:", error);
          currentParticipants = [];
        }
      }

      const headers = ["ref", "score"];
      const participantRows =
        currentParticipants && currentParticipants.length > 0
          ? currentParticipants.map((participant) => {
              const student = participant.student || {};
              const grade = participant.grade || {};
              return [student.ref ?? "", grade.score ?? ""];
            })
          : [["STD12345", ""]];

      const worksheet = XLSX.utils.aoa_to_sheet([
        headers,
        ...participantRows,
        ["# ref est obligatoire"],
        ["# Laisser score vide pour ne pas modifier la note existante"],
        ["# Le champ comment est optionnel"],
      ]);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notes Examen");

      XLSX.writeFile(workbook, `Note ${examName || "Examen"}.xlsx`);

      notify("Modèle téléchargé avec succès", {
        type: "success",
        autoHideDuration: 20000,
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      notify("Erreur lors du téléchargement du modèle", {
        type: "error",
        autoHideDuration: 20000,
      });
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          startIcon={<Upload />}
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            pl: 2,
            color: "#474645",
            textTransform: "none",
          }}
          onClick={toggle}
          label="importer"
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
            console.log(response);
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
          />

          <FormDataConsumer>
            {({formData}) =>
              formData.mode === "UPDATE" && (
                <TextInput
                  source="comment"
                  label="Commentaire"
                  fullWidth
                  required
                />
              )
            }
          </FormDataConsumer>
        </FileUploadDialog>
        <ButtonBase
          startIcon={<Download />}
          onClick={downloadTemplate}
          disabled={isDownloadingTemplate}
        >
          {isDownloadingTemplate ? "Téléchargement..." : "Modèle"}
        </ButtonBase>
      </Box>
      <Dialog
        open={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Résultat de l'import</DialogTitle>
        <DialogContent>
          {importResult && (
            <>
              <Typography>
                <strong>Total:</strong>{" "}
                {importResult.importGradeStats.totalRows} |{" "}
                <strong>Valides:</strong>{" "}
                {importResult.importGradeStats.validRows} |{" "}
                <strong>Invalides:</strong>{" "}
                {importResult.importGradeStats.invalidRows}
              </Typography>

              <Box sx={{mt: 2, maxHeight: 400, overflowY: "auto"}}>
                <table style={{width: "100%", borderCollapse: "collapse"}}>
                  <thead>
                    <tr>
                      <th style={{border: "1px solid #ddd", padding: "8px"}}>
                        Référence
                      </th>
                      <th style={{border: "1px solid #ddd", padding: "8px"}}>
                        Note
                      </th>
                      <th style={{border: "1px solid #ddd", padding: "8px"}}>
                        Raison
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.invalidGrades.map((grade, idx) => (
                      <tr key={idx}>
                        <td style={{border: "1px solid #ddd", padding: "8px"}}>
                          {grade.ref}
                        </td>
                        <td style={{border: "1px solid #ddd", padding: "8px"}}>
                          {grade.score !== null ? grade.score : "N/A"}
                        </td>
                        <td style={{border: "1px solid #ddd", padding: "8px"}}>
                          {grade.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
