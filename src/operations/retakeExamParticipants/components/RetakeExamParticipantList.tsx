import {FileDownloader} from "@/operations/common/components";
import {RetakeExamButtons} from "@/operations/retakeExams/components/RetakeExamButtons";
import dataProvider from "@/providers/dataProvider";
import {HaList} from "@/ui/haList";
import {RetakeExam, StudentRetakeExam} from "@haapi-b0fc7615/typescript-client";
import {Download} from "@mui/icons-material";
import {BookOpenCheckIcon} from "lucide-react";
import {ReactElement} from "react";
import {
  FieldProps,
  RecordContextProvider,
  TextField,
  useRecordContext,
  useRefresh,
} from "react-admin";
import {useLocation, useParams} from "react-router-dom";

type ParticipantWithRetakeExam = StudentRetakeExam & {retake_exam?: RetakeExam};

// `label` is read by the Datagrid header, not by the cell itself.
const RetakeExamButtonsCell: (
  props: Readonly<FieldProps>
) => ReactElement | null = () => {
  const participant = useRecordContext<ParticipantWithRetakeExam>();
  const refresh = useRefresh();
  if (!participant) return null;

  const retakeExam: RetakeExam = participant.retake_exam ?? participant;

  return (
    <RecordContextProvider value={retakeExam}>
      <RetakeExamButtons onSuccess={() => refresh()} />
    </RecordContextProvider>
  );
};

export const RetakeExamParticipantList = () => {
  const courseId = useParams()?.id;
  const sessionId = useLocation().state?.sessionId;

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("retakeExams-course-participants-export", {
      id: courseId ?? "",
      meta: {sessionId},
    });
    return {data: file};
  };

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
      actions={
        <FileDownloader
          downloadFunction={downloadFile}
          fileName="Liste des rattrapages de la matière.xlsx"
          startIcon={<Download />}
          buttonText="Exporter"
          successMessage="Exportation en cours..."
          errorMessage="Une erreur est survenue lors de l'exportation du fichier."
          fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      }
    >
      <TextField source="student_identifier.first_name" label="Nom" />
      <TextField source="student_identifier.last_name" label="Prénom" />
      <TextField source="student_identifier.ref" label="Référence" />
      <TextField source="student_identifier.email" label="Email" />
      <RetakeExamButtonsCell label="Actions" />
    </HaList>
  );
};
