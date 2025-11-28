import ExcelIcon from "@/assets/xls.png";
import {useNotify, useToggle} from "@/hooks";
import {FileUploadDialog} from "@/operations/common/components/FileUploadDialog";
import {Loader} from "@/operations/common/components/Loader";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import examGradeProvider from "@/providers/examGradeProvider";
import {useRole} from "@/security/hooks";
import {ButtonBase} from "@/ui/haToolbar";
import {Download, Upload} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {useGetList, useRefresh} from "react-admin";
import * as XLSX from "xlsx";

export const ExamGradeListActions = ({examId, examName}) => {
  const [isOpen, , toggle] = useToggle();
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    message: "",
  });
  const [participants, setParticipants] = useState([]);
  const {isManager, isAdmin, isTeacher} = useRole();
  const hasPermission = isManager() || isAdmin() || isTeacher();
  const notify = useNotify();
  const refresh = useRefresh();

  const {data: participantsData} = useGetList("exam-grades", {
    pagination: {page: 1, perPage: MAX_ITEM_PER_PAGE},
    meta: {examId},
  });

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
        ["# student_ref est obligatoire"],
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
          data-testid="import-grades-button"
          startIcon={<Upload />}
          sx={{
            width: "100%",
            justifyContent: "start",
            paddingLeft: "20px",
            paddingTop: "7px",
            paddingBottom: "7px",
            color: "#474645",
            textTransform: "none",
          }}
          onClick={toggle}
        >
          Importer
        </Button>
        <FileUploadDialog
          meta={{examId}}
          isOpen={isOpen}
          onClose={toggle}
          title="Importer les notes"
          resource="import-grades"
          accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          fileIcon={ExcelIcon}
          fileIconAlt="Excel"
          saveButtonLabel="Lancer l'import"
          confirmContent="Êtes-vous certain de vouloir lancer l'import avec le fichier sélectionné ?"
        />
        <ButtonBase
          startIcon={<Download />}
          onClick={downloadTemplate}
          disabled={isDownloadingTemplate}
        >
          {isDownloadingTemplate ? "Téléchargement..." : "Modèle"}
        </ButtonBase>
      </Box>
      <Dialog
        open={isImporting}
        disableEscapeKeyDown
        PaperProps={{
          sx: {minWidth: 400, p: 2},
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Loader size={24} />
            <Typography variant="h6">Import des notes en cours</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{mt: 2, mb: 3}}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {importProgress.message}
            </Typography>
            {importProgress.total > 0 && (
              <>
                <Box sx={{mt: 2, mb: 1}}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (importProgress.current / importProgress.total) * 100
                    }
                    sx={{height: 8, borderRadius: 4}}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {importProgress.current} / {importProgress.total} opérations
                  terminées
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
