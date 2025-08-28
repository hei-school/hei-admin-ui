import {Box, Divider, Typography} from "@mui/material";
import {useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

import {
  ExamDetails,
  ExamHeader,
  ExamLoadError,
  ParticipantsDataGrid,
} from "@/operations/grades/components";

export const ExamParticipantList = () => {
  const {id: examId} = useParams<{id: string}>();

  if (!examId) {
    return <Typography>ID d'examen manquant</Typography>;
  }

  const {data: exam, isLoading, isError} = useGetOne("exams", {id: examId});

  if (isLoading) return <Typography>Chargement des données...</Typography>;
  if (isError) return <ExamLoadError />;
  if (!exam) return <Typography>Examen introuvable</Typography>;

  return (
    <Box
      mx="auto"
      display="flex"
      flexDirection="column"
      width="calc(100% - 20px)"
      mt={3}
    >
      <ExamHeader exam={exam} />
      <ExamDetails exam={exam} />
      <Divider sx={{mt: 1, mb: 1, width: "90%", mx: "auto"}} />
      <ParticipantsDataGrid examId={examId!} />
    </Box>
  );
};
