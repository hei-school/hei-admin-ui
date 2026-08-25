import {RetakeExamButtons} from "@/operations/retakeExams/components/RetakeExamButtons";
import {HaList} from "@/ui/haList";
import {RetakeExam, Student} from "@haapi-3d601c85/typescript-client";
import {BookOpenCheckIcon} from "lucide-react";
import {FC} from "react";
import {
  FieldProps,
  RecordContextProvider,
  TextField,
  useRecordContext,
  useRefresh,
} from "react-admin";
import {useLocation, useParams} from "react-router-dom";

type ParticipantWithRetakeExam = Student & {retake_exam?: RetakeExam};

const RetakeExamButtonsCell: FC<FieldProps> = () => {
  const participant = useRecordContext<ParticipantWithRetakeExam>();
  const refresh = useRefresh();
  if (!participant) return null;

  const retakeExam =
    participant.retake_exam ?? (participant as unknown as RetakeExam);

  return (
    <RecordContextProvider value={retakeExam}>
      <RetakeExamButtons onSuccess={() => refresh()} />
    </RecordContextProvider>
  );
};

export const RetakeExamParticipantList = () => {
  const courseId = useParams()?.id;
  const sessionId = useLocation().state?.sessionId;
  return (
    <HaList
      title="Liste des étudiants"
      resource="retakeExams-participants"
      icon={<BookOpenCheckIcon />}
      datagridProps={{rowClick: false}}
      mainSearch={{source: "ref", label: "Référence (STDXXXXX)"}}
      listProps={{
        title: "Détails de la matière",
        filter: {courseId, sessionId},
      }}
      actions={undefined}
    >
      <TextField source="student_identifier.first_name" label="Nom" />
      <TextField source="student_identifier.last_name" label="Prénom" />
      <TextField source="student_identifier.ref" label="Référence" />
      <TextField source="student_identifier.email" label="Email" />
      <RetakeExamButtonsCell label="Actions" />
    </HaList>
  );
};
