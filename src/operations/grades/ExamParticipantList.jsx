import {PALETTE_COLORS} from "@/haTheme";
import {DateField} from "@/operations/common/components/fields";
import {
  ExamGradeListActions,
  ExamLoadError,
} from "@/operations/grades/components";
import {HaList} from "@/ui/haList";
import {formatDate} from "@/utils/date";
import {
  Book,
  ImportContactsOutlined as BookIcon,
  PeopleOutline as GroupIcon,
  PermIdentityOutlined as PersonIcon,
} from "@mui/icons-material";
import {Box, Chip, Divider, Paper, Tooltip, Typography} from "@mui/material";
import {Clock, InfoIcon} from "lucide-react";
import {TextField, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

const ExamHeader = ({title, coefficient}) => (
  <Box
    display="flex"
    justifyContent="space-between"
    borderRadius="20px 20px 0px 0px"
    px={5}
    pt={5}
    pb={5}
    bgcolor={PALETTE_COLORS.yellow}
  >
    <Typography
      variant="h5"
      display="flex"
      alignItems="center"
      fontWeight="bolder"
      gap={2}
    >
      <InfoIcon /> Détails de l'examen {title}
    </Typography>
    <Box
      py="3px"
      fontSize="14px"
      fontWeight="bold"
      overflow="hidden"
      whiteSpace="nowrap"
      display="inline-block"
      minWidth="fit-content"
      textOverflow="ellipsis"
      borderRadius={20}
      bgcolor={PALETTE_COLORS.white}
      px={1.5}
    >
      {`Coef. ${coefficient}`}
    </Box>
  </Box>
);

const ExamDetailsChips = ({exam}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      display: "flex",
      flexWrap: "wrap",
      overflow: "hidden",
      mb: 3,
      boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
      gap: 1.5,
    }}
  >
    <Tooltip title="Date de l'examen" arrow>
      <Chip
        clickable
        label={`Le ${formatDate(exam?.examination_date)}`}
        icon={<Clock size={20} />}
        sx={{fontWeight: 600}}
      />
    </Tooltip>
    <Tooltip title="Cours" arrow>
      <Chip
        clickable
        label={`Cours de ${exam?.awarded_course?.course?.code}`}
        icon={<BookIcon />}
        sx={{fontWeight: 600}}
      />
    </Tooltip>
    <Tooltip title="Groupe" arrow>
      <Chip
        clickable
        label={`Groupe ${exam?.awarded_course?.group?.ref}`}
        icon={<GroupIcon />}
        sx={{fontWeight: 600}}
      />
    </Tooltip>
    <Tooltip title="Enseignant" arrow>
      <Chip
        clickable
        label={`${exam?.awarded_course?.main_teacher?.first_name ?? ""} ${exam?.awarded_course?.main_teacher?.last_name ?? ""}`}
        icon={<PersonIcon />}
        sx={{fontWeight: 600}}
      />
    </Tooltip>
  </Paper>
);

export const ExamParticipantList = () => {
  const {id: examId} = useParams();
  const {data: exam, isLoading, isError} = useGetOne("exams", {id: examId});

  if (isLoading) return <Typography>Chargement des données...</Typography>;
  if (isError) return <ExamLoadError />;

  return (
    <Box>
      <Box
        mx="auto"
        display="flex"
        flexDirection="column"
        width="calc(100% - 20px)"
        mt={3}
      >
        <ExamHeader title={exam?.title} coefficient={exam?.coefficient} />
        <ExamDetailsChips exam={exam} />
      </Box>

      <Divider sx={{mt: 1, mb: 1, width: "90%", mx: "auto"}} />

      <HaList
        icon={<Book />}
        resource="exam-grades"
        title="Liste des participants"
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
        <DateField source="grade.update_date" label="Mis à jour le" />
      </HaList>
    </Box>
  );
};
