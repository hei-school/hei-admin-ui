import {HaList} from "@/ui/haList";
import {BookOpenCheckIcon} from "lucide-react";
import {TextField} from "react-admin";

export const RetakeExamSessionShow = () => {
  return (
    <HaList
      title={undefined}
      resource="retakeExams-sessions"
      icon={<BookOpenCheckIcon />}
      listProps={{
        title: "Liste des élèves inscrits à cette session de rattrapage",
      }}
      actions={undefined}
    >
      <TextField source="session.title" label="Titre de la session" />
      <TextField source="student_identifier.first_name" label="Nom" />
      <TextField source="student_identifier.last_name" label="Prénom" />
      <TextField source="student_identifier.ref" label="STD" />
      <TextField source="course.code" label="Matière" />
      <TextField source="registration_date" label="Souscri le" />
    </HaList>
  );
};
