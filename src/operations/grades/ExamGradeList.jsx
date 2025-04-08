import {DateField} from "@/operations/common/components/fields";
import {
  ExamGradeListActions,
  ExamLoadError,
} from "@/operations/grades/components";
import {HaList} from "@/ui/haList";
import {Book} from "@mui/icons-material";
import {Typography} from "@mui/material";
import {TextField, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

export const ExamGradeList = () => {
  const {id: examId} = useParams();
  const {data: exam, isLoading, isError} = useGetOne("exams", {id: examId});

  if (isLoading) return <Typography>Chargement des données...</Typography>;
  if (isError) return <ExamLoadError />;

  return (
    <HaList
      icon={<Book />}
      resource="exam-grades"
      title={`Liste des participants à l'examen ${exam?.title} (coef: ${exam?.awarded_course.course.credits})`}
      datagridProps={{rowClick: false}}
      listProps={{
        queryOptions: {meta: {examId}},
        title: "Notes des participants",
      }}
      actions={<ExamGradeListActions examId={examId} />}
    >
      <TextField source="student.ref" label="Référence" />
      <TextField source="student.last_name" label="Nom" />
      <TextField source="student.first_name" label="Prénom(s)" />
      <TextField source="grade.score" label="Note" />
      <DateField source="grade.created_at" label="Créée le" />
      <DateField source="grade.update_date" label="Mis à jour le" />
    </HaList>
  );
};
