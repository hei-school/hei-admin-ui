import {
  Book,
  ImportContactsOutlined as BookIcon,
  Create as EditIcon,
  PeopleOutline as GroupIcon,
  PermIdentityOutlined as PersonIcon,
} from "@mui/icons-material";
import {Box, Chip, Divider, Paper, Tooltip, Typography} from "@mui/material";
import {Clock, InfoIcon} from "lucide-react";
import {
  Button,
  maxValue,
  minValue,
  number,
  NumberInput,
  required,
  SaveButton,
  SimpleForm,
  TextField,
  Toolbar,
  useGetOne,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";
import {useParams} from "react-router-dom";

import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {DateField} from "@/operations/common/components/fields";
import {
  ExamGradeListActions,
  ExamLoadError,
} from "@/operations/grades/components";
import gradeProvider from "@/providers/gradeProvider";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {formatDate} from "@/utils/date";
import {useState} from "react";

const ExamHeader = ({exam}) => (
  <Box
    display="flex"
    borderRadius="20px 20px 0 0"
    justifyContent="space-between"
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
      <InfoIcon />
      Détails de l'examen {exam.title}
    </Typography>
    <Chip
      label={`Coef. ${exam.coefficient}`}
      sx={{
        py: "3px",
        fontSize: "14px",
        fontWeight: "bold",
        bgcolor: PALETTE_COLORS.white,
        borderRadius: 20,
        minWidth: "fit-content",
      }}
    />
  </Box>
);

const ExamDetailChip = ({icon, tooltip, label}) => (
  <Tooltip title={tooltip} arrow>
    <Chip clickable label={label} icon={icon} sx={{fontWeight: 600}} />
  </Tooltip>
);

const ExamDetails = ({exam}) => {
  const CourseAssignment = exam?.course_assignment;
  const mainTeacher = CourseAssignment?.main_teacher;

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
        mb: 3,
        p: 2.5,
        gap: 1.5,
      }}
    >
      <ExamDetailChip
        icon={<Clock size={20} />}
        tooltip="Date de l'examen"
        label={`Le ${formatDate(exam?.examination_date)}`}
      />
      <ExamDetailChip
        icon={<BookIcon />}
        tooltip="Cours"
        label={`Cours de ${CourseAssignment?.course?.code}`}
      />
      <ExamDetailChip
        icon={<GroupIcon />}
        tooltip="Groupe"
        label={`Groupe ${
          CourseAssignment?.groups?.map((group) => group.ref).join(", ") ||
          "non défini"
        }`}
      />
      <ExamDetailChip
        icon={<PersonIcon />}
        tooltip="Enseignant"
        label={`${mainTeacher?.first_name ?? ""} ${mainTeacher?.last_name ?? ""}`}
      />
    </Paper>
  );
};

const GradeEditForm = ({onSubmit, isLoading, onClose}) => (
  <Dialog title="Modification d'une note" open={true} onClose={onClose}>
    <SimpleForm
      onSubmit={onSubmit}
      toolbar={
        <Toolbar>
          <SaveButton saving={isLoading} disabled={isLoading} />
        </Toolbar>
      }
    >
      <NumberInput
        source="grade.score"
        label="Note"
        fullWidth
        validate={[required(), number(), maxValue(20), minValue(0)]}
      />
    </SimpleForm>
  </Dialog>
);

const GradeEditButton = ({examId}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, , toggleDialog] = useToggle(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const {
    student: {id: studentId},
  } = useRecordContext();

  const handleGradeSubmit = async (formValues) => {
    setIsLoading(true);
    try {
      await gradeProvider.saveOrUpdate(
        {score: formValues.grade?.score},
        {examId, studentId}
      );
      notify("Note mise à jour avec succès", {type: "success"});
      toggleDialog();
      refresh();
    } catch (error) {
      notify("Erreur lors de la mise à jour de la note", {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Button
        label="ÉDITER"
        variant="text"
        data-testid="edit-button"
        onClick={toggleDialog}
        sx={{py: "5px", color: PALETTE_COLORS.yellow}}
        startIcon={<EditIcon />}
      />
      {isDialogOpen && (
        <GradeEditForm
          onSubmit={handleGradeSubmit}
          isLoading={isLoading}
          onClose={() => toggleDialog(false)}
        />
      )}
    </Box>
  );
};

const ParticipantsDataGrid = ({examId}) => (
  <HaList
    icon={<Book />}
    resource="exam-grades"
    title="Liste des participants"
    datagridProps={{rowClick: false}}
    listProps={{
      queryOptions: {meta: {examId}},
      title: "Notes des participants",
      className: "participants-list",
    }}
    actions={<ExamGradeListActions examId={examId} />}
    data-testid="participants-list"
  >
    <TextField source="student.ref" label="Référence" />
    <TextField source="student.last_name" label="Nom" />
    <TextField source="student.first_name" label="Prénom(s)" />
    <TextField source="grade.score" label="Note" />
    <DateField source="grade.update_date" label="Mis à jour le" />
    <GradeEditButton examId={examId} />
  </HaList>
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
        <ExamHeader exam={exam} />
        <ExamDetails exam={exam} />
      </Box>
      <Divider sx={{mt: 1, mb: 1, width: "90%", mx: "auto"}} />
      <ParticipantsDataGrid examId={examId} />
    </Box>
  );
};
