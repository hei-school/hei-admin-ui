import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import correctGradeProvider from "@/providers/correctGradeProvider";
import createGradeProvider from "@/providers/createGradeProvider";
import {Create as EditIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {EyeIcon} from "lucide-react";
import {useState} from "react";
import {Button, useNotify, useRecordContext, useRefresh} from "react-admin";
import {GradeEditForm} from "./GradeEditForm";
import {GradeHistoryDialog} from "./GradeHistoryDialog";
import {ExamGradeRecord} from "./ParticipantsDataGrid";

interface GradeEditButtonProps {
  examId: string;
  record: ExamGradeRecord;
}

export const GradeEditButton = ({examId, record}: GradeEditButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, , toggleDialog] = useToggle(false);
  const [isHistoryOpen, , toggleHistory] = useToggle(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const {student: {id: studentId, ref: studentRef} = {}} = useRecordContext();

  const isEditing = record?.grade?.score != null;

  const handleGradeSubmit = async (formValues: any) => {
    setIsLoading(true);
    try {
      if (!studentId) throw new Error("Identifiant de l'étudiant manquant");

      if (isEditing) {
        await correctGradeProvider.saveOrUpdate(
          {
            grade: {score: formValues.grade?.score, student_id: studentId},
            student_ref: studentRef,
            comment: formValues.comment || "",
          },
          {examId, studentId}
        );
      } else {
        await createGradeProvider.saveOrUpdate(
          {score: formValues.grade?.score, student_id: studentId},
          {examId, studentId}
        );
      }

      notify("Note enregistrée avec succès", {type: "success"});
      toggleDialog();
      refresh();
    } catch {
      notify("Erreur lors de la mise à jour de la note", {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Button
        label={isEditing ? "ÉDITER" : "ATTRIBUER"}
        variant="text"
        onClick={toggleDialog}
        sx={{py: "5px", color: PALETTE_COLORS.yellow}}
        startIcon={<EditIcon />}
        disabled={!record || !studentId}
      />
      {isEditing && (
        <Button
          variant="text"
          onClick={toggleHistory}
          sx={{color: PALETTE_COLORS.primary}}
          startIcon={<EyeIcon />}
          disabled={!record || !studentId}
        />
      )}
      {isDialogOpen && (
        <GradeEditForm
          onSubmit={handleGradeSubmit}
          isLoading={isLoading}
          onClose={() => toggleDialog()}
          isEditing={isEditing}
        />
      )}
      {isHistoryOpen && (
        <GradeHistoryDialog
          onClose={() => toggleHistory()}
          studentId={studentId}
          examId={examId}
          gradeId={record?.grade?.id}
        />
      )}
    </Box>
  );
};
