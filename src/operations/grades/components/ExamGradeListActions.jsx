import {useNotify} from "@/hooks";
import {Loader} from "@/operations/common/components/Loader";
import {
  GRADE_HEADERS,
  transformGradesData,
  validateGradeData,
} from "@/operations/grades/utils";
import {exportGradeTemplate} from "@/operations/grades/utils/xlsxExport";
import createGradeProvider from "@/providers/createGradeProvider";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import examGradeProvider from "@/providers/examGradeProvider";
import {useRole} from "@/security/hooks";
import {ButtonBase, ImportButton} from "@/ui/haToolbar";
import {Download} from "@mui/icons-material";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useGetList, useRefresh} from "react-admin";

export const ExamGradeListActions = ({examId, examName}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [participants, setParticipants] = useState([]);
  const {isManager, isAdmin, isTeacher} = useRole();
  const hasPermission = isManager() || isAdmin() || isTeacher();
  const notify = useNotify();
  const refresh = useRefresh();

  const {data: participantsData} = useGetList("exam-grades", {
    pagination: {page: 1, perPage: MAX_ITEM_PER_PAGE},
    meta: {examId},
  });

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

  const handleImport = async (data) => {
    try {
      setIsImporting(true);
      setValidationErrors([]);
      setImportProgress({
        current: 0,
        total: 0,
        message: "Préparation de l'import...",
      });

      const validation = validateGradeData(data);
      if (!validation.isValid) {
        setValidationErrors([validation.message]);
        setIsImporting(false);
        return;
      }

      const transformedData = data[1] || [];
      const processedItems = transformedData
        .map((row) => {
          const participant = participants.find(
            (p) => p.student?.ref === row.student_ref
          );
          const studentId = participant?.student?.id || null;
          const hasExistingGrade = participant?.grade?.id != null;

          let score = row.grade?.score ?? null;
          if (score !== null && score !== undefined) {
            score = Math.max(0, Math.min(20, score));
          }

          const hasScore = score !== null && score !== undefined;
          const comment =
            row.comment || (hasScore ? "Note modifiée via import" : "");

          return {
            student_ref: row.student_ref,
            comment: comment,
            grade: {
              score: hasScore ? score : null,
              student_id: studentId,
            },
            hasExistingGrade,
          };
        })
        .filter((item) => item.grade.student_id !== null);

      if (processedItems.length === 0) {
        notify("Aucun étudiant trouvé pour l'import des notes", {
          type: "warning",
        });
        return;
      }

      const itemsToCreate = processedItems.filter(
        (item) => !item.hasExistingGrade
      );
      const itemsToUpdate = processedItems
        .filter((item) => item.hasExistingGrade)
        .map(({hasExistingGrade, ...item}) => item);

      const totalOperations =
        itemsToCreate.length + (itemsToUpdate.length > 0 ? 1 : 0);
      setImportProgress({
        current: 0,
        total: totalOperations,
        message: `Traitement de ${processedItems.length} note(s)...`,
      });

      const results = [];
      let completed = 0;

      for (const item of itemsToCreate) {
        try {
          setImportProgress({
            current: completed,
            total: totalOperations,
            message: `Création de la note pour ${item.student_ref}...`,
          });

          const result = await createGradeProvider.saveOrUpdate(
            {score: item.grade.score},
            {examId, studentId: item.grade.student_id}
          );
          results.push(result);
          completed++;
        } catch (error) {
          console.error(
            `Error creating grade for student ${item.student_ref}:`,
            error
          );
          throw error;
        }
      }

      if (itemsToUpdate.length > 0) {
        setImportProgress({
          current: completed,
          total: totalOperations,
          message: `Mise à jour de ${itemsToUpdate.length} note(s) existante(s)...`,
        });

        const result = await examGradeProvider.saveOrUpdate(itemsToUpdate, {
          examId,
        });
        results.push(result);
        completed++;
      }

      setImportProgress({
        current: totalOperations,
        total: totalOperations,
        message: "Finalisation de l'import...",
      });
      notify("Import réussi", {type: "success"});
      refresh();
      return results;
    } catch (error) {
      setValidationErrors([
        `Erreur d'import: ${error.response?.data?.message || error.message}`,
      ]);
      throw error;
    } finally {
      setIsImporting(false);
      setImportProgress({current: 0, total: 0, message: ""});
    }
  };

  const downloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
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

      const fileName = `Notes ${examName}`;

      exportGradeTemplate(currentParticipants, fileName);

      notify("Modèle téléchargé avec succès", {type: "success"});
    } catch (error) {
      console.error("Error downloading template:", error);
      notify("Erreur lors du téléchargement du modèle", {type: "error"});
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        {validationErrors.length > 0 && (
          <Box sx={{mb: 2, width: "100%", maxWidth: 600}}>
            {validationErrors.map((error, index) => (
              <Alert
                key={index}
                severity="error"
                sx={{mb: 1}}
                onClose={() =>
                  setValidationErrors((errors) =>
                    errors.filter((_, i) => i !== index)
                  )
                }
              >
                {error}
              </Alert>
            ))}
          </Box>
        )}
        <ImportButton
          validateData={validateGradeData}
          resource="notes"
          provider={handleImport}
          transformData={transformGradesData}
          minimalHeaders={GRADE_HEADERS.minimal}
          optionalHeaders={GRADE_HEADERS.optional}
          disabled={isImporting}
          title="Importer des notes"
          description="Sélectionnez un fichier Excel contenant les notes des étudiants"
          hideNewTemplate={true}
        />
        <ButtonBase
          startIcon={
            isDownloadingTemplate ? <Loader size={16} /> : <Download />
          }
          onClick={downloadTemplate}
          disabled={isImporting || isDownloadingTemplate}
          sx={{mt: 1}}
        >
          {isDownloadingTemplate
            ? "Téléchargement..."
            : "Télécharger le modèle"}
        </ButtonBase>
      </Box>
      <Dialog
        open={isImporting || isDownloadingTemplate}
        disableEscapeKeyDown
        PaperProps={{
          sx: {minWidth: 400, p: 2},
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Loader size={24} />
            <Typography variant="h6">
              {isDownloadingTemplate
                ? "Téléchargement du modèle"
                : "Import des notes en cours"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{mt: 2, mb: 3}}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {isDownloadingTemplate
                ? "Génération et téléchargement du modèle Excel..."
                : importProgress.message}
            </Typography>
            {!isDownloadingTemplate && importProgress.total > 0 && (
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
            {isDownloadingTemplate && (
              <Box sx={{mt: 2, mb: 1}}>
                <LinearProgress sx={{height: 8, borderRadius: 4}} />
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
