import {ToRaRecord} from "@/providers/types";
import {CourseResult, Grade} from "@haapi/typescript-client";
import {ExpandMore as ExpandMoreIcon} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {FC, useState} from "react";
import {useGetList} from "react-admin";
import {getCourseStatusLabel} from "../utils";
import {getGradeColor} from "../utils/getGradeColor";
import {getStatusChipProps} from "../utils/getStatusChipProps";
import {StatusChip} from "../utils/StatusChip";
import {TableMessageRow} from "../utils/TableMessageRow";

interface GradesListProps {
  studentId: string;
  courseId: string;
}

export const GradesDetails: FC<{
  studentId: string;
  courseResult: CourseResult;
}> = ({studentId, courseResult}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => setShowDetails((prev) => !prev);

  const chipProps = getStatusChipProps(courseResult?.status || "NOT_STARTED");

  return (
    <Grid item xs={12} mt={4} data-testid="course-result-card">
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #e0e2e5",
          background: "#f8f9fa",
        }}
      >
        <CardContent sx={{p: 3}}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {courseResult?.course?.name} ({courseResult?.course?.code})
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Chip
                  label={`${courseResult.course?.credits!} crédits ECTS`}
                  size="small"
                  sx={{fontWeight: "medium"}}
                />
                <StatusChip
                  label={getCourseStatusLabel(courseResult?.status!)}
                  size="small"
                  status={courseResult?.status!}
                  color={chipProps.color}
                  variant={chipProps.variant}
                />
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{color: getGradeColor(courseResult?.weighted_average!)}}
              >
                {courseResult?.weighted_average!.toFixed(2)}/20
              </Typography>
            </Box>
          </Box>

          <Box sx={{my: 3}}>
            <Box
              sx={{
                position: "relative",
                height: 8,
                width: "100%",
                bgcolor: "grey.200",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${(courseResult.weighted_average! / 20) * 100}%`,
                  background: `linear-gradient(90deg, ${getGradeColor(courseResult.weighted_average! - 2)}, ${getGradeColor(courseResult.weighted_average!)})`,
                  borderRadius: 4,
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </Box>
          </Box>
        </CardContent>

        <Divider />
        <Collapse in={showDetails} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Détail des évaluations
            </Typography>
            <GradesList
              courseId={courseResult.course?.id!}
              studentId={studentId}
            />
          </CardContent>
        </Collapse>
        <Button
          fullWidth
          onClick={toggleShowDetails}
          data-testid="toggle-details-button"
          sx={{
            justifyContent: "space-between",
            p: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            color: "text.secondary",
          }}
          endIcon={
            <ExpandMoreIcon
              sx={{
                transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                transition: (theme) =>
                  theme.transitions.create("transform", {
                    duration: theme.transitions.duration.short,
                  }),
              }}
            />
          }
        >
          {showDetails
            ? "Masquer le détail des évaluations"
            : "Afficher le détail des évaluations"}
        </Button>
      </Card>
    </Grid>
  );
};

const GradesList: FC<GradesListProps> = ({courseId, studentId}) => {
  const {data: grades = [], isLoading} = useGetList<ToRaRecord<Grade>>(
    "grades-details",
    {
      filter: {studentId, courseId},
    },
    {refetchOnWindowFocus: false}
  );

  const renderGradeScore = (score: number) => (
    <Typography
      fontWeight="bold"
      color={score >= 10 ? "success.main" : "error.main"}
    >
      {score.toFixed(2)}/20
    </Typography>
  );

  const renderStatusChip = (score: number) => (
    <Chip
      label={score >= 10 ? "Validé" : "Non validé"}
      size="small"
      color={score >= 10 ? "success" : "error"}
      variant="outlined"
    />
  );

  const renderDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("fr-FR")
      : "non modifié";

  if (isLoading) {
    return (
      <TableMessageRow message="Chargement des détails..." type="loading" />
    );
  }

  if (!Array.isArray(grades) || grades.length === 0) {
    return <TableMessageRow message="Aucune note trouvée" type="empty" />;
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{mt: 2, border: "1px solid #e0e2e5", borderRadius: 2}}
      data-testid="grades-details"
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Évaluation</TableCell>
            <TableCell align="right">Note</TableCell>
            <TableCell align="right">Coefficient</TableCell>
            <TableCell align="right">Date de l'examen</TableCell>
            <TableCell align="center">
              Date de la dernière modification
            </TableCell>
            <TableCell align="center">Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grades.map((grade) => (
            <TableRow
              key={grade.id}
              sx={{"&:last-child td, &:last-child th": {border: 0}}}
              data-testid="grades-details-row"
            >
              <TableCell component="th" scope="row">
                {grade.exam?.title}
              </TableCell>
              <TableCell align="right">
                {renderGradeScore(grade.score)}
              </TableCell>
              <TableCell align="right">{grade.exam?.coefficient}</TableCell>
              <TableCell align="right">
                {renderDate(grade?.created_at?.toString())}
              </TableCell>
              <TableCell align="center">
                {renderDate(grade?.update_date?.toString())}
              </TableCell>
              <TableCell align="center">
                {renderStatusChip(grade.score)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
