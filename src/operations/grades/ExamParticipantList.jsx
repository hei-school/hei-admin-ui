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
  minValue,
  number,
  required,
  SaveButton,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  useGetOne,
  useRecordContext,
} from "react-admin";
import {useParams} from "react-router-dom";

import {PALETTE_COLORS} from "@/haTheme";
import {useNotify, useToggle} from "@/hooks";
import {Edit} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {
  ExamGradeListActions,
  ExamLoadError,
} from "@/operations/grades/components";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {formatDate} from "@/utils/date";

const ExamHeader = ({title, coefficient}) => (
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
      Détails de l'examen {title}
    </Typography>
    <Box
      py="3px"
      fontSize="14px"
      overflow="hidden"
      fontWeight="bold"
      whiteSpace="nowrap"
      minWidth="fit-content"
      textOverflow="ellipsis"
      px={1.5}
      borderRadius={20}
      bgcolor={PALETTE_COLORS.white}
    >
      {`Coef. ${coefficient}`}
    </Box>
  </Box>
);

const ExamDetails = ({exam}) => (
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

const GradeEditButton = () => {
  const notify = useNotify();
  const {id} = useRecordContext();
  const [showEdit, , toggleEdit] = useToggle();

  return (
    <Box>
      <Button
        label="EDITER"
        variant="text"
        data-testid="edit-button"
        onClick={toggleEdit}
        sx={{py: "5px", color: PALETTE_COLORS.yellow}}
        startIcon={<EditIcon />}
      />
      <Dialog
        title="Modification d'une note"
        open={showEdit}
        onClose={toggleEdit}
      >
        <Edit
          id={id}
          title=" "
          resource="grade"
          mutationOptions={{
            onSuccess: () => {
              notify("Cours mis à jour");
              toggleEdit();
            },
          }}
        >
          <SimpleForm
            toolbar={
              <Toolbar>
                <SaveButton />
              </Toolbar>
            }
          >
            <TextInput
              source="grade.score"
              label="Note"
              validate={[required(), number(), minValue(0)]}
              fullWidth
            />
          </SimpleForm>
        </Edit>
      </Dialog>
    </Box>
  );
};

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
        <ExamDetails exam={exam} />
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
        <GradeEditButton />
      </HaList>
    </Box>
  );
};
