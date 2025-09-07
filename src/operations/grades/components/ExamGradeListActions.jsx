import {useNotify} from "@/hooks";
import {
  GRADE_HEADERS,
  transformGradesData,
  validateGradeData,
} from "@/operations/grades/utils";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import examGradeProvider from "@/providers/examGradeProvider";
import {useRole} from "@/security/hooks";
import {ButtonBase, ImportButton} from "@/ui/haToolbar";
import {Download} from "@mui/icons-material";
import {Box} from "@mui/material";
import {useEffect, useState} from "react";
import {useGetList} from "react-admin";
import * as XLSX from "xlsx";

export const ExamGradeListActions = ({examId}) => {
  const {isManager, isAdmin, isTeacher} = useRole();
  const notify = useNotify();
  const [isImporting, setIsImporting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const hasPermission = isManager() || isAdmin() || isTeacher();

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

      const flattened = data.flatMap((entry) => entry[1]);
      
      const payload = flattened.map((row) => ({
        grade: {
          score: row.score ?? null,
          student_id: row.student_id ?? null,
        },
        student_ref: row.student_ref,
        comment: row.comment ?? null,
      }));
      
      console.log("Payload to send:", payload);

      const result = await examGradeProvider.saveOrUpdate(payload, {examId});
      notify("Import réussi", {type: "success"});
      return result;
    } catch (error) {
      console.error("Import error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      notify(`Erreur d'import: ${error.response?.data?.message || error.message}`, {type: "error"});
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = async () => {
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

    // Headers in the exact order they appear in Excel
    const headers = ["student_ref", "score", "comment"];
    const participantRows =
      currentParticipants && currentParticipants.length > 0
        ? currentParticipants.map((participant) => {
            const student = participant.student || {};
            const grade = participant.grade || {};
            return [
              student.ref ?? "",
              grade.score ?? "",
              "",
            ];
          })
        : [["STD12345", "", ""]];

    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...participantRows,
      ["# student_ref est obligatoire"],
      ["# Laisser score vide pour ne pas modifier la note existante"],
      ["# Le champ comment est optionnel"],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Notes Examen");

    XLSX.writeFile(
      workbook,
      `notes_examen_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
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
      />
      <ButtonBase startIcon={<Download />} onClick={downloadTemplate}>
        Modèle
      </ButtonBase>
    </Box>
  );
};
