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
import {StatusChip} from "../utils/StatusChip";
import {getGradeColor} from "../utils/getGradeColor";
import {getStatusChipProps} from "../utils/getStatusChipProps";

export const GradesDetails: FC<{
  studentId: string;
  courseResult: CourseResult;
}> = ({studentId, courseResult}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => setShowDetails((prev) => !prev);

  const chipProps = getStatusChipProps(courseResult?.status || "NOT_STARTED");

  return (
    <Grid item xs={12} mt={4}>
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
                  label={chipProps.label}
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
                  width: `${(courseResult!.weighted_average! / 20) * 100}%`,
                  background: `linear-gradient(90deg, ${getGradeColor(courseResult!.weighted_average! - 2)}, ${getGradeColor(courseResult.weighted_average!)})`,
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

const GradesList: FC<{
  studentId: string;
  courseId: string;
}> = ({courseId, studentId}) => {
  const {data: courseDetails = []} = useGetList<ToRaRecord<Grade>>(
    "grades-details",
    {
      filter: {
        studentId,
        courseId,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{mt: 2, border: "1px solid #e0e2e5", borderRadius: 2}}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Évaluation</TableCell>
            <TableCell align="right">Note</TableCell>
            <TableCell align="right">Pondération</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="center">Dernière Modification</TableCell>
            <TableCell align="center">Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(courseDetails) && courseDetails.length > 0 ? (
            courseDetails.map((courseDetail) => (
              <TableRow
                key={courseDetail.id}
                sx={{"&:last-child td, &:last-child th": {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {courseDetail.exam?.course_assignment?.course?.name}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    fontWeight="bold"
                    color={
                      courseDetail?.score >= 10 ? "success.main" : "error.main"
                    }
                  >
                    {courseDetail.score.toFixed(2)}/20
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {courseDetail.exam?.coefficient!}%
                </TableCell>
                <TableCell align="right">
                  {new Date(courseDetail?.created_at!).toLocaleDateString(
                    "fr-FR"
                  )}
                </TableCell>
                <TableCell align="center">
                  {courseDetail?.update_date
                    ? new Date(courseDetail?.update_date!).toLocaleDateString(
                        "fr-FR"
                      )
                    : "non modifié"}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={courseDetail?.score >= 10 ? "Validé" : "Non validé"}
                    size="small"
                    color={courseDetail?.score >= 10 ? "success" : "error"}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Aucun détail disponible pour ce cours.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
