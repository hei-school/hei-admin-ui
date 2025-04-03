import examGradeProvider from "@/providers/examGradeProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {ImportButton, validateData} from "@/ui/haToolbar";
import {Book, InfoOutlined} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {TextField, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import {DateField} from "@/operations/common/components/fields";

// TODO: Refactor this
const minimalGradeHeaders = [
  {id: 1, label: "Référence", value: "student_id", disabled: true},
  {id: 1, label: "Note", value: "grade.score", disabled: true},
];

const optionalGradeHeaders = [];

const validateGradeData = (data) => {
  return validateData(
    data,
    minimalGradeHeaders.map((el) => el.value)
  );
};

const transformGradesData = (data) => {
  const grades = transformGradeData(data);
  return [[[], grades]];
};

const transformGradeData = (data) => {
  return data.map((element) => {
    console.log(element);
  });
};

const ListActions = ({examId}) => {
  const {isManager, isAdmin, isTeacher} = useRole();

  return (
    <Box>
      {(isManager() || isAdmin() || isTeacher()) && (
        <Box>
          <ImportButton
            validateData={validateGradeData}
            resource="notes"
            provider={(data) => {
              return examGradeProvider.saveOrUpdate(data, {
                examId,
              });
            }}
            transformData={transformGradesData}
            minimalHeaders={minimalGradeHeaders}
            optionalHeaders={optionalGradeHeaders}
          />
        </Box>
      )}
    </Box>
  );
};

export const ExamGradeList = () => {
  const {id: examId} = useParams();
  const {data: exam, isLoading, isError} = useGetOne("exams", {id: examId});

  if (isLoading) return <Typography>Chargement des données...</Typography>;
  if (isError)
    return (
      <Box
        sx={{
          padding: 3,
          backgroundColor: "background.paper",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <InfoOutlined sx={{color: "text.secondary"}} />
        <Box>
          <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
            Erreur
          </Typography>
          <Typography variant="body2" sx={{color: "text.secondary"}}>
            Impossible de charger les informations de l'examen.
          </Typography>
        </Box>
      </Box>
    );

  return (
    <HaList
      icon={<Book />}
      resource="exam-grades"
      title={`Liste des participants à l'examen ${exam?.title}`}
      datagridProps={{rowClick: false}}
      listProps={{
        queryOptions: {meta: {examId}},
        title: "Notes des participants",
      }}
      actions={<ListActions examId={examId} />}
    >
      <TextField source="student.ref" label="Référence" />
      <TextField source="student.last_name" label="Nom" />
      <TextField source="student.first_name" label="Prénom(s)" />
      <TextField source="grade.score" label="Note" />
      <DateField source="grade.created_at" label="Créée le" showTime />
      <DateField source="grade.update_date" label="Mis à jour le" showTime />
    </HaList>
  );
};
