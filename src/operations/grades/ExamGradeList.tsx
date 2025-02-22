import {HaList} from "@/ui/haList";
import {Book, InfoOutlined} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {TextField, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

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
    <Box>
      <HaList
        icon={<Book />}
        resource="exam-grades"
        title={`Liste des participants à l'examen ${exam?.title}`}
        datagridProps={{rowClick: false}}
        listProps={{filter: {examId}, title: "Notes des participants"}}
        actions={false}
      >
        <TextField source="student.ref" label="Référence" />
        <TextField source="student.last_name" label="Nom" />
        <TextField source="student.first_name" label="Prénom(s)" />
        <TextField source="grade.score" label="Note" />
        <TextField source="grade.created_at" label="Créée le" />
        <TextField source="grade.updated_at" label="Mis à jour le" />
      </HaList>
    </Box>
  );
};
