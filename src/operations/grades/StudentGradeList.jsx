import {HaList} from "@/ui/haList";
import {Book} from "@mui/icons-material";
import {TextField} from "react-admin";

export const StudentGradeList = ({studentId}) => {
  return (
    <HaList
      icon={<Book />}
      resource="student-grades"
      title="Liste des notes"
      datagridProps={{rowClick: false}}
      listProps={{filter: {studentId}, title: "Notes"}}
      actions={false}
    >
      <TextField source="course.code" label="Matière" />
      <TextField source="exams[0].grade.score" label="Notes" />
      <TextField source="exams[0].grade.created_at" label="Créée le" />
      <TextField source="exams[0].grade.updated_at" label="Mis à jour le" />
    </HaList>
  );
};
