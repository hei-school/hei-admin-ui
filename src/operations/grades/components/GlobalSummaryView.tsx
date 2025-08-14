import {ToRaRecord} from "@/providers/types";
import {ResultSummary} from "@haapi/typescript-client";
import {
  Cancel,
  CheckCircleOutline,
  HourglassEmpty,
  School,
  ThumbDown,
  ThumbUp,
  Warning,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {FC} from "react";
import {useGetOne} from "react-admin";
import {getCourseStatusLabel} from "../utils";
import {getGradeColor} from "../utils/getGradeColor";
import {StatusChips} from "../utils/StatusChip";

export const GlobalSummaryView: FC<{studentId: string}> = ({studentId}) => {
  const {data: summary_result} = useGetOne<ToRaRecord<ResultSummary>>(
    "summary",
    {
      id: studentId!,
    }
  );

  return (
    <Box>
      <Card sx={{mb: 3, boxShadow: 3, borderRadius: 2}}>
        <CardContent>
          <Typography variant="h5" sx={{mb: 2, fontWeight: "bold"}}>
            Synthèse Globale
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  "p": 2,
                  "display": "flex",
                  "alignItems": "center",
                  "borderRadius": 2,
                  "boxShadow": 3,
                  "background": "rgba(255, 255, 255, 0.2)",
                  "backdropFilter": "blur(10px)",
                  "border": "1px solid rgba(255, 255, 255, 0.3)",
                  "color": "text.primary",
                  "transition": "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <School sx={{fontSize: 40, mr: 2, color: "primary.main"}} />
                <Box>
                  <Typography fontWeight={"bold"}>Moyenne Pondérée</Typography>
                  <Typography variant="h4" sx={{fontWeight: "bold"}}>
                    {summary_result?.weighted_average
                      ? summary_result?.weighted_average?.toFixed(2)
                      : 0}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  "p": 2,
                  "display": "flex",
                  "alignItems": "center",
                  "borderRadius": 2,
                  "boxShadow": 3,
                  "background": "rgba(255, 255, 255, 0.2)",
                  "backdropFilter": "blur(10px)",
                  "border": "1px solid rgba(255, 255, 255, 0.3)",
                  "color": "text.primary",
                  "transition": "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box sx={{position: "relative", display: "inline-flex", mr: 2}}>
                  <CircularProgress
                    variant="determinate"
                    value={
                      (summary_result?.obtained_credits! /
                        summary_result?.total_credits!) *
                      100
                    }
                    size={60}
                    thickness={4}
                    sx={{
                      color: getGradeColor(
                        (summary_result?.obtained_credits! /
                          summary_result?.total_credits!) *
                          100
                      ),
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {(() => {
                      const ratio =
                        summary_result?.obtained_credits! /
                        summary_result?.total_credits!;

                      if (ratio >= 1) {
                        return (
                          <CheckCircleOutline
                            sx={{fontSize: 30, color: "success.main"}}
                          />
                        );
                      } else if (ratio >= 0.5) {
                        return (
                          <ThumbUp sx={{fontSize: 30, color: "info.main"}} />
                        );
                      } else if (ratio > 0) {
                        return (
                          <Warning sx={{fontSize: 30, color: "warning.main"}} />
                        );
                      } else {
                        return (
                          <ThumbDown sx={{fontSize: 30, color: "error.main"}} />
                        );
                      }
                    })()}
                  </Box>
                </Box>
                <Box>
                  <Typography fontWeight={"bold"}>Crédits Obtenus</Typography>
                  <Typography variant="h4" sx={{fontWeight: "bold"}}>
                    {summary_result?.obtained_credits
                      ? summary_result?.obtained_credits
                      : 0}
                    /
                    {summary_result?.total_credits
                      ? summary_result?.total_credits
                      : 0}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  "p": 2,
                  "display": "flex",
                  "alignItems": "center",
                  "borderRadius": 2,
                  "boxShadow": 3,
                  "background": "rgba(255, 255, 255, 0.2)",
                  "backdropFilter": "blur(10px)",
                  "border": "1px solid rgba(255, 255, 255, 0.3)",
                  "color": "text.primary",
                  "transition": "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {(() => {
                  switch (summary_result?.status) {
                    case "VALIDATED":
                      return (
                        <CheckCircleOutline
                          sx={{fontSize: 40, mr: 2, color: "success.main"}}
                        />
                      );
                    case "IN_PROGRESS":
                      return (
                        <HourglassEmpty
                          sx={{fontSize: 40, mr: 2, color: "warning.main"}}
                        />
                      );
                    case "INVALIDATED":
                      return (
                        <Cancel
                          sx={{fontSize: 40, mr: 2, color: "error.main"}}
                        />
                      );
                    default:
                      return null;
                  }
                })()}
                <Box>
                  <Typography fontWeight={"bold"}>Statut</Typography>
                  <StatusChips
                    variant="filled"
                    status={summary_result?.status!}
                    label={getCourseStatusLabel(summary_result?.status!)}
                    sx={{
                      height: "auto",
                      p: "8px 12px",
                      borderRadius: "16px",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
