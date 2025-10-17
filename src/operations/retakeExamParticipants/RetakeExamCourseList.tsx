import {HaList} from "@/ui/haList";
import {BookOpenCheckIcon} from "lucide-react";
import {ShowButton, TextField, useRecordContext} from "react-admin";
import {useParams} from "react-router-dom";

const ShowButtonWithSession = ({sessionId}: {sessionId?: string}) => {
  const course = useRecordContext();
  return <ShowButton record={course} state={{sessionId}} />;
};

export const RetakeExamCourseList = () => {
  const {id: sessionId} = useParams<{id: string}>();

  return (
    <HaList
      title="Liste des matières à rattraper"
      resource="retakeExams-participants"
      icon={<BookOpenCheckIcon />}
      datagridProps={{
        rowClick: false,
      }}
      mainSearch={{
        source: "code",
        label: "Cours ex: prog2",
      }}
      listProps={{
        title: " ",
        filter: {sessionId},
      }}
      actions={undefined}
    >
      <TextField source="code" label="Matière" />
      <TextField source="name" label="Titre" />
      <TextField source="level" label="Niveau" />
      <TextField source="credits" label="Crédits" />
      <ShowButtonWithSession sessionId={sessionId} />
    </HaList>
  );
};
