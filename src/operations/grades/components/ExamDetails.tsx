import {formatDate} from "@/utils/date";
import {Exam} from "@haapi-3d601c85/typescript-client";
import {
  ImportContactsOutlined as BookIcon,
  PeopleOutline as GroupIcon,
  PermIdentityOutlined as PersonIcon,
} from "@mui/icons-material";
import {Paper} from "@mui/material";
import {Clock} from "lucide-react";
import {ExamDetailChip} from "./ExamDetailChip";

interface ExamDetailsProps {
  exam: Exam;
}

export const ExamDetails = ({exam}: ExamDetailsProps) => {
  const course = exam?.course_assignment?.course?.code;
  const groups =
    exam?.course_assignment?.groups?.map((g) => g.ref).join(", ") ||
    "non défini";
  const teacher = exam?.course_assignment?.main_teacher;

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
        mb: 3,
        p: 2.5,
        gap: 1.5,
      }}
    >
      <ExamDetailChip
        icon={<Clock size={20} />}
        tooltip="Date de l'examen"
        label={`Le ${formatDate(exam?.examination_date)}`}
      />
      <ExamDetailChip
        icon={<BookIcon />}
        tooltip="Cours"
        label={`Cours de ${course}`}
      />
      <ExamDetailChip
        icon={<GroupIcon />}
        tooltip="Groupe"
        label={`Groupe ${groups}`}
      />
      <ExamDetailChip
        icon={<PersonIcon />}
        tooltip="Enseignant"
        label={`${teacher?.first_name ?? ""} ${teacher?.last_name ?? ""}`}
      />
    </Paper>
  );
};
