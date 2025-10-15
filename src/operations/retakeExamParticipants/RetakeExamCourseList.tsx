import {HaList} from "@/ui/haList";
import {BookOpenCheckIcon} from "lucide-react";
import {ShowButton, TextField, useRecordContext} from "react-admin";
import {useParams} from "react-router-dom";

const ShowButtonWithSession = () => {
  const sessionId = useParams()?.id;
  const course = useRecordContext();
  return <ShowButton record={course} state={{sessionId}} />;
};

export const RetakeExamCourseList = () => {
  const sessionId = useParams()?.id;
  return (
    <HaList
      title="Liste des matières a rattraper"
      resource="retakeExams-participants"
      icon={<BookOpenCheckIcon />}
      datagridProps={{
        rowClick: false,
      }}
      mainSearch={{
        source: "code",
        label: "Cours ex:prog2",
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
      <ShowButtonWithSession />
    </HaList>
  );
};
