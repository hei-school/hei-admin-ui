import {EmptyList3D} from "@/operations/common/components/EmptyList";
import {CourseResult, YearlyResult} from "@haapi-b0fc7615/typescript-client";
import {ExpandMore, Lock, Star} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  keyframes,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import {FC} from "react";
import {getCourseStatusLabel} from "../utils";
import {StatusChips} from "../utils/StatusChip";
import {renderWeightedAverage} from "./utils";

export const ResultSummaryTimeline: FC<{yearlyResult: YearlyResult[]}> = ({
  yearlyResult,
}) => {
  const theme = useTheme();
  const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 142, 83, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 142, 83, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 142, 83, 0); }
`;

  if (yearlyResult.length === 0) {
    return (
      <Box
        data-testid="empty-block"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "25rem",
          maxWidth: "25rem",
          marginLeft: "35%",
        }}
      >
        <EmptyList3D />
      </Box>
    );
  }

  return (
    <Box>
      {yearlyResult.map((details, index) => {
        const isLocked = details?.status === "NOT_STARTED";
        return (
          <Grid
            container
            key={details.level}
            sx={{mb: 2, position: "relative"}}
          >
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: isLocked
                    ? theme.palette.grey[700]
                    : details?.status!.includes("VALID")
                      ? theme.palette.success.main
                      : theme.palette.warning.main,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  boxShadow: 3,
                  animation: details?.status!.includes("PROGRESS")
                    ? `${pulse} 2s infinite`
                    : "none",
                }}
              >
                {isLocked ? <Lock /> : <Star />}
              </Box>
              {index < yearlyResult.length - 1 && (
                <Box
                  sx={{
                    width: "4px",
                    height: "100%",
                    background: `linear-gradient(to bottom, ${isLocked ? theme.palette.grey[700] : details?.status?.includes("VALIDATED") ? theme.palette.success.main : theme.palette.warning.main}, ${isLocked ? theme.palette.grey[700] : theme.palette.divider})`,
                    position: "absolute",
                    top: "40px",
                    zIndex: 0,
                  }}
                />
              )}
            </Grid>
            <Grid
              item
              xs={11}
              sx={{pl: 2}}
              data-testid="yearly-result-accordion"
            >
              <Accordion
                disabled={isLocked}
                sx={{
                  "boxShadow": 3,
                  "borderRadius": 2,
                  "&:before": {display: "none"},
                  "border": `1px solid ${theme.palette.divider}`,
                  "backgroundColor": isLocked
                    ? "rgba(255, 255, 255, 0.1)"
                    : "background.paper",
                  "backdropFilter": isLocked ? "blur(10px)" : "none",
                }}
              >
                <AccordionSummary
                  data-testid="accordion-summary-button"
                  sx={{
                    gap: 2,
                  }}
                  expandIcon={
                    <ExpandMore
                      sx={{
                        fontSize: "1.6rem",
                        backgroundColor: "#d4d4d4ff",
                        borderRadius: "50%",
                        color: theme.palette.primary.main,
                        padding: "4px",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  }
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">{`Année: ${details.level}`}</Typography>
                    <StatusChips
                      sx={{
                        marginRight: 1,
                      }}
                      status={details?.status!}
                      label={getCourseStatusLabel(details?.status)}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2} sx={{mb: 2}}>
                    <Grid item xs={6}>
                      <Typography data-testid="yearly-result-average">
                        Moyenne: {details?.weighted_average?.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography data-testid="yearly-result-credits">
                        {`Crédits: ${details?.obtained_credits} / ${details?.total_credits}`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <CourseList courses={details?.course_results || []} />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

const CourseList: FC<{courses: CourseResult[]}> = ({courses}) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Cours</TableCell>
            <TableCell align="right">Moyenne</TableCell>
            <TableCell align="right">Crédits</TableCell>
            <TableCell align="right">Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course, index) => (
            <TableRow
              sx={{"&:last-child td, &:last-child th": {border: 0}}}
              key={course.id || index}
              data-testid="courses-lists-row"
            >
              <TableCell component="th" scope="row">
                {course?.course?.name}
              </TableCell>
              <TableCell align="right">
                {renderWeightedAverage(course?.weighted_average)}
              </TableCell>
              <TableCell align="right">{course?.course?.credits}</TableCell>
              <TableCell align="right">
                <StatusChips
                  status={course?.status!}
                  label={getCourseStatusLabel(course?.status!)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
