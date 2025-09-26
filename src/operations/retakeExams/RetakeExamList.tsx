import {EnrollButton} from "@/operations/retakeExams/components/EnrollButton";
import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";
import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {BookOpenIcon} from "lucide-react";
import {DateField, TextField, useGetList} from "react-admin";

const RETAKE_EXAM_LIST_SX = {
  "& .RaList-content": {
    "& .MuiTableRow-root": {
      "cursor": "default !important",
      "pointerEvents": "none",
      "&:hover": {backgroundColor: "transparent !important"},
      "&.Mui-selected": {backgroundColor: "transparent !important"},
      "& .MuiButton-root, & button": {pointerEvents: "auto"},
    },
    "& .MuiTableCell-root": {
      "cursor": "default !important",
      "&:hover": {backgroundColor: "transparent !important"},
      "& .MuiButton-root, & button": {pointerEvents: "auto"},
    },
  },
  "& .MuiTableCell-root": {
    userSelect: "text",
    cursor: "default !important",
  },
};

// TODO: add session list before rattrapage list for specific students
export const RetakeExamList = () => {
  const studentId = authProvider.getCachedWhoami()?.id;
  const {data: sessions = [], isLoading} = useGetList("retakeExams-sessions");

  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  if (!sessions.length) {
    return <div>Aucune session de rattrapage disponible pour le moment.</div>;
  }

  const sessionId = sessions[0].id;

  return (
    <HaList
      title="Listes de mes rattrapages"
      resource="retakeExams"
      icon={<BookOpenIcon />}
      listProps={{
        title: "Rattrapages",
        filter: {studentId, sessionId},
        disableRowClick: true,
        rowClick: false,
        sx: RETAKE_EXAM_LIST_SX,
      }}
      actions={undefined}
    >
      <TextField source="course.code" label="Matière" />
      <TextField source="course.name" label="Nom du cours" />
      <DateField source="session.date_from" label="Début" />
      <DateField source="session.date_to" label="Fin" />
      <DateField
        source="registration_date"
        label="Inscrit le"
        emptyText="Non défini"
      />
      <EnrollButton
        alreadyInscribed={(retakeExam: RetakeExam) =>
          !!retakeExam.registration_date
        }
      />
    </HaList>
  );
};
