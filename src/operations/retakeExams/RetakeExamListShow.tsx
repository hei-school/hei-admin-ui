import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";
import {BookOpenIcon} from "lucide-react";
import {DateField, TextField, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import {Buttons} from "./components";

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

interface RetakeExamListShowContentProps {
  studentId?: string;
  sessionId?: string;
}

export const RetakeExamListShow = () => {
  const studentId = authProvider.getCachedWhoami()?.id;
  const {id: sessionId} = useParams();
  if (!studentId || !sessionId) return null;

  return (
    <RetakeExamListShowContent studentId={studentId} sessionId={sessionId} />
  );
};

const RetakeExamListShowContent = ({
  studentId,
  sessionId,
}: RetakeExamListShowContentProps) => {
  const {data: session} = useGetOne("retakeExams-sessions", {id: sessionId});
  return (
    <HaList
      title={`Rattrapages – ${session?.title ?? "Session"}`}
      icon={<BookOpenIcon />}
      resource="retakeExams"
      listProps={{
        title: "Liste de mes rattrapages",
        filter: {studentId, sessionId},
        disableRowClick: true,
        rowClick: false,
        sx: RETAKE_EXAM_LIST_SX,
      }}
      actions={false}
    >
      <TextField source="course.code" label="Code matière" />
      <TextField source="course.name" label="Nom du cours" />
      <DateField source="session.date_from" label="Début" />
      <DateField source="session.date_to" label="Fin" />
      <DateField
        source="registration_date"
        label="Inscrit le"
        emptyText="Non défini"
      />
      <Buttons />
    </HaList>
  );
};
