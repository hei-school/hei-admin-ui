import {ExamGradeEditButton} from "@/operations/grades/ExamGradeEditButton";
import {HaList} from "@/ui/haList";
import {Book, InfoOutlined} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {ShowButton, TextField, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

export const ExamGradeList = () => {
  const {id: examId} = useParams();
  const {data: exam, isLoading, isError} = useGetOne("exams", {id: examId});
  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    if (exam) {
      setGroupId(exam.awarded_course?.group?.id);
    }
  }, [exam]);

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
      resource="group-students"
      title={`Liste des participants à l'examen ${exam?.title}`}
      datagridProps={{rowClick: false}}
      listProps={{
        title: "Notes des participants",
        queryOptions: {meta: {groupId}},
      }}
      actions={false}
    >
      {/* TODO: Handle the 'Required parameter id was null or undefined when calling getStudentsByGroupId' error here */}
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom(s)" />
      <TextField source="last_name" label="Nom(s)" />
      <ExamGradeEditButton />
      <ShowButton />
    </HaList>
  );
};
