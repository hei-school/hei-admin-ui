import {
  Book,
  ImportContactsOutlined as BookIcon,
  Create as EditIcon,
  PeopleOutline as GroupIcon,
  PermIdentityOutlined as PersonIcon,
  History as HistoryIcon,
  TrendingUp as TrendIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import {
  Box, 
  Chip, 
  Divider, 
  Paper, 
  Tooltip, 
  Typography,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {Clock, EyeIcon, InfoIcon} from "lucide-react";
import {
  Button,
  FunctionField,
  maxValue,
  minValue,
  number,
  NumberInput,
  required,
  SaveButton,
  SimpleForm,
  TextField,
  TextInput,
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
import correctGradeProvider from "@/providers/correctGradeProvider";
import createGradeProvider from "@/providers/createGradeProvider";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {formatDate} from "@/utils/date";
import {useEffect, useState} from "react";

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

const GradeEditForm = ({
  onSubmit,
  isLoading,
  onClose,
  isEditing,
  initialComment,
}) => (
  <Dialog
    title={isEditing ? "Modifier la note" : "Attribuer une note"}
    open
    onClose={onClose}
    fullWidth
    maxWidth="sm"
  >
    <SimpleForm
      onSubmit={onSubmit}
      defaultValues={
        isEditing ? {grade: {score: undefined}, comment: initialComment} : {}
      }
      toolbar={
        <Toolbar>
          <SaveButton
            saving={isLoading}
            disabled={isLoading}
            label="Enregistrer"
          />
        </Toolbar>
      }
    >
      <NumberInput
        source="grade.score"
        label="Note"
        fullWidth
        validate={[required(), number(), minValue(0), maxValue(20)]}
      />
      {isEditing && (
        <TextInput source="comment" label="Commentaire" fullWidth multiline />
      )}
    </SimpleForm>
  </Dialog>
);

const GradeHistoryItem = ({historyItem, isLatest, isLast}) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const {date, time} = formatDateTime(historyItem.created_at);
  const hasComment = historyItem.comment && historyItem.comment !== 'string';

  return (
    <Box display="flex" gap={2} mb={isLast ? 0 : 3}>
      <Box display="flex" flexDirection="column" alignItems="center" minWidth="40px">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: isLatest ? PALETTE_COLORS.yellow : PALETTE_COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isLatest ? `0 0 0 4px ${PALETTE_COLORS.yellow}20` : 'none',
            color: 'white'
          }}
        >
          {isLatest ? <TrendIcon fontSize="small" /> : <HistoryIcon fontSize="small" />}
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              height: 60,
              bgcolor: PALETTE_COLORS.grey + '30',
              mt: 1
            }}
          />
        )}
      </Box>
      <Box flex={1}>
        <Card 
          elevation={0}
          sx={{
            border: `1px solid ${isLatest ? PALETTE_COLORS.yellow : PALETTE_COLORS.grey}20`,
            borderRadius: 2,
            bgcolor: isLatest ? `${PALETTE_COLORS.yellow}08` : 'background.paper'
          }}
        >
          <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar 
                  sx={{
                    width: 32, 
                    height: 32, 
                    bgcolor: isLatest ? PALETTE_COLORS.yellow : PALETTE_COLORS.primary,
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {historyItem.score}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    Note: {historyItem.score}/20
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isLatest ? 'Note actuelle' : 'Ancienne note'}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={isLatest ? 'ACTUEL' : 'HISTORIQUE'}
                size="small"
                sx={{
                  bgcolor: isLatest ? PALETTE_COLORS.yellow : PALETTE_COLORS.grey + '20',
                  color: isLatest ? 'white' : 'text.secondary',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            <Box display="flex" alignItems="center" gap={2} mb={hasComment ? 1.5 : 0}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Clock size={14} color={PALETTE_COLORS.grey} />
                <Typography variant="caption" color="text.secondary">
                  {date} à {time}
                </Typography>
              </Box>
            </Box>
            {hasComment && (
              <Box 
                sx={{
                  bgcolor: PALETTE_COLORS.grey + '10',
                  borderRadius: 1,
                  p: 1.5,
                  borderLeft: `3px solid ${PALETTE_COLORS.primary}`
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <CommentIcon sx={{fontSize: 16, color: PALETTE_COLORS.primary}} />
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    Commentaire
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary">
                  {historyItem.comment}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const GradeHistoryDialog = ({onClose, studentId, examId}) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));        
        const mockData = [
          {
            "created_at": "2025-08-28T06:25:53.812Z",
            "score": 12.5,
            "comment": "Bonne compréhension des concepts de base, mais quelques erreurs dans l'application pratique."
          },
          {
            "created_at": "2025-08-27T14:30:22.156Z", 
            "score": 10.0,
            "comment": "Première correction - travail à améliorer"
          },
          {
            "created_at": "2025-08-26T09:15:45.789Z",
            "score": 8.5,
            "comment": "Note initiale"
          }
        ];
        
        const sortedData = mockData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setHistoryData(sortedData);
      } catch (err) {
        setError("Erreur lors du chargement de l'historique");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [studentId, examId]);

  return (
    <Dialog
      title="Historique des modifications"
      open
      onClose={onClose}
      maxWidth="md"
    >
      <Box>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <Box textAlign="center">
              <CircularProgress size={40} sx={{color: PALETTE_COLORS.primary, mb: 2}} />
              <Typography variant="body2" color="text.secondary">
                Chargement de l'historique...
              </Typography>
            </Box>
          </Box>
        ) : error ? (
          <Box py={4}>
            <Alert severity="error" sx={{borderRadius: 2}}>
              {error}
            </Alert>
          </Box>
        ) : historyData.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <HistoryIcon sx={{fontSize: 48, color: PALETTE_COLORS.grey, mb: 2}} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              Aucun historique disponible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cette note n'a pas encore été modifiée.
            </Typography>
          </Box>
        ) : (
          <>
            <Box display="flex" alignItems="center" gap={2} my={3} px={1}>
              <HistoryIcon sx={{color: PALETTE_COLORS.primary}} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Historique des modifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {historyData.length} modification{historyData.length > 1 ? 's' : ''} enregistrée{historyData.length > 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{px: 1}}>
              {historyData.map((item, index) => (
                <GradeHistoryItem 
                  key={`${item.created_at}-${index}`}
                  historyItem={item}
                  isLatest={index === 0}
                  isLast={index === historyData.length - 1}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
};

const GradeEditButton = ({examId, record}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, , toggleDialog] = useToggle(false);
  const [isHistoryOpen, , toggleHistory] = useToggle(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const {student: {id: studentId, ref: studentRef} = {}} = useRecordContext();

  const isEditing = record?.grade?.score != null;
  const buttonLabel = isEditing ? "ÉDITER" : "ATTRIBUER";

  const handleGradeSubmit = async (formValues) => {
    setIsLoading(true);
    try {
      if (!studentId) throw new Error("Identifiant de l'étudiant manquant");

      if (isEditing) {
        const gradeData = {
          grade: {
            score: formValues.grade?.score,
            student_id: studentId,
          },
          student_ref: studentRef,
          comment: formValues.comment || "",
        };

        await correctGradeProvider.saveOrUpdate(gradeData, {examId, studentId});
      } else {
        const gradeData = {
          score: formValues.grade?.score,
          student_id: studentId,
        };

        await createGradeProvider.saveOrUpdate(gradeData, {examId, studentId});
      }

      notify("Note enregistrée avec succès", {type: "success"});
      toggleDialog();
      refresh();
    } catch (error) {
      notify("Erreur lors de la mise à jour de la note", {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" gap={1}>
      <Button
        label={buttonLabel}
        variant="text"
        data-testid="edit-button"
        onClick={toggleDialog}
        sx={{py: "5px", color: PALETTE_COLORS.yellow}}
        startIcon={<EditIcon />}
        disabled={!record || !studentId}
      />
      {isEditing && (
        <Button
          variant="text"
          onClick={toggleHistory}
          sx={{color: PALETTE_COLORS.primary}}
          startIcon={<EyeIcon />}
          disabled={!record || !studentId}
        />
      )}
      {isDialogOpen && (
        <GradeEditForm
          onSubmit={handleGradeSubmit}
          isLoading={isLoading}
          onClose={() => toggleDialog(false)}
          isEditing={isEditing}
          initialComment={record?.grade?.comment}
        />
      )}
      {isHistoryOpen && (
        <GradeHistoryDialog 
          onClose={() => toggleHistory(false)} 
          studentId={studentId}
          examId={examId}
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
    <FunctionField
      label="Note"
      render={(record) => {
        const score = record?.grade?.score;
        return score !== null && score !== undefined ? score : "Non définie";
      }}
    />
    <DateField source="grade.update_date" label="Mis à jour le" />
    <FunctionField
      label="Actions"
      render={(record) => <GradeEditButton examId={examId} record={record} />}
    />
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
