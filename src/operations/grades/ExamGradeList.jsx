import {transformUsersData} from "@/operations/students/importConf";
import {
  minimalUserHeaders,
  optionalUserHeaders,
  validateUserData,
} from "@/operations/utils/userImportConf";
import examGradeProvider from "@/providers/examGradeProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {ImportButton} from "@/ui/haToolbar";
import {get27thOfMonth} from "@/utils/date";
import {Book, InfoOutlined} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {TextField, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

const ListActions = () => {
  const {isManager, isAdmin, isTeacher} = useRole();

  return (
    <Box>
      {(isManager() || isAdmin() || isTeacher()) && (
        <Box>
          <ImportButton
            validateData={validateUserData}
            resource="exam-grades"
            provider={(data) => {
              return examGradeProvider.saveOrUpdate(data, {
                meta: {
                  dueDatetime: get27thOfMonth(
                    date.getFullYear(),
                    date.getMonth()
                  ),
                },
              });
            }}
            transformData={transformUsersData}
            minimalHeaders={minimalUserHeaders}
            optionalHeaders={optionalUserHeaders}
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
      listProps={{filter: {examId}, title: "Notes des participants"}}
      actions={<ListActions />}
    >
      <TextField source="student.ref" label="Référence" />
      <TextField source="student.last_name" label="Nom" />
      <TextField source="student.first_name" label="Prénom(s)" />
      <TextField source="grade.score" label="Note" />
      <TextField source="grade.created_at" label="Créée le" />
      <TextField source="grade.updated_at" label="Mis à jour le" />
    </HaList>
  );
};
