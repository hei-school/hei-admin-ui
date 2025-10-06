import {HaList} from "@/ui/haList";
import {BookOpenCheckIcon} from "lucide-react";
import {TextField} from "react-admin";
import {useParams} from "react-router-dom";
export const RetakeExamSessionShow = () => {
  const {id} = useParams();
  const sessionId = id;
  return (
    <HaList
      title="Liste des matières"
      resource="retakeExams-participants"
      icon={<BookOpenCheckIcon />}
      listProps={{
        title: "Matières",
        filter: {sessionId},
        disableRowClick: true,
        rowClick: false,
      }}
      actions={undefined}
    >
      <TextField source="code" label="Matière" />
      <TextField source="name" label="Titre" />
      <TextField source="level" label="Niveau" />
      <TextField source="credits" label="Crédits" />
    </HaList>
  );
};
