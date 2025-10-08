import {HaList} from "@/ui/haList";
import {BookOpenCheckIcon} from "lucide-react";
import {FunctionField, TextField} from "react-admin";
import {useLocation, useParams} from "react-router-dom";

export const RetakeExamParticipantList = () => {
  const courseId = useParams()?.id;
  const sessionId = useLocation().state?.sessionId;

  return (
    <HaList
      title="Liste des étudiants"
      resource="retakeExams-participants"
      icon={<BookOpenCheckIcon />}
      datagridProps={{
        rowClick: false,
      }}
      mainSearch={{
        source: "ref",
        label: "Référence (STD)",
      }}
      listProps={{
        title: "Détails de la matière",
        filter: {
          courseId,
          sessionId,
        },
      }}
      actions={undefined}
    >
      <TextField source="first_name" label="Nom" />
      <TextField source="last_name" label="Prénom" />
      <TextField source="ref" label="STD" />
      <FunctionField
        label="Groupe"
        render={(groupeRef) => groupeRef?.groups?.[0]?.ref || "-"}
      />
      <TextField source="email" label="Email" />
    </HaList>
  );
};
