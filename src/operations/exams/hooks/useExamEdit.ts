import {Exam} from "@haapi-3d601c85/typescript-client";
import {useState} from "react";
import {useNotify, useRefresh, useUpdate} from "react-admin";

interface UseExamEditProps {
  exam: Exam;
  onClose: () => void;
}

interface ExamUpdateData {
  id: string;
  title: string;
  examination_date: string;
  coefficient: {
    numerator: number;
    denominator: number;
  };
  course_assignment_id: string;
}

export const useExamEdit = ({exam, onClose}: UseExamEditProps) => {
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const updateData: ExamUpdateData = {
        id: exam.id!,
        title: data.title,
        examination_date: data.examination_date,
        coefficient: {
          numerator: data.coefficient?.numerator,
          denominator: data.coefficient?.denominator,
        },
        course_assignment_id: data.course_assignment_id,
      };

      await update("exams", {
        id: exam.id,
        data: updateData,
      });

      notify("Examen modifié avec succès", {type: "success"});
      refresh();
      onClose();
    } catch (error) {
      console.error("Error updating exam:", error);
      notify("Erreur lors de la modification de l'examen", {type: "error"});
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
};
