import {HaList} from "@/ui/haList";
import {Student} from "@haapi-b0fc7615/typescript-client";
import {BookOpenCheckIcon} from "lucide-react";
import {FC} from "react";
import {FunctionField, TextField} from "react-admin";
import {useLocation, useParams} from "react-router-dom";

const GroupeMapping: FC<{groups: {ref?: string}[]}> = ({groups}) => {
  const refs = groups.flatMap((g) => (g.ref ? [g.ref] : []));
  return <span>{refs.length ? refs.join(", ") : "Aucun groupe"}</span>;
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
      mainSearch={{source: "ref", label: "Référence (STD)"}}
      listProps={{
        title: "Détails de la matière",
        filter: {courseId, sessionId},
      }}
      actions={undefined}
    >
      <TextField source="first_name" label="Nom" />
      <TextField source="last_name" label="Prénom" />
      <TextField source="ref" label="STD" />
      <FunctionField<Student>
        label="Groupes"
        render={(student) => <GroupeMapping groups={student.groups ?? []} />}
      />
      <TextField source="email" label="Email" />
    </HaList>
  );
};
