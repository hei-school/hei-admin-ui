import {ToRaRecord} from "@/providers/types";
import {ResultSummary} from "@haapi-3d601c85/typescript-client";
import {
  Autorenew,
  Block,
  DoNotDisturbOn,
  HourglassDisabled,
  MilitaryTech,
  School,
  TrendingUp,
  Verified,
  WorkspacePremium,
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
import {ResultSummaryTimeline} from "./ResultTimeline";

export const GlobalSummaryView: FC<{studentId: string}> = ({studentId}) => {
  const {data: summary_result, isLoading} = useGetOne<
    ToRaRecord<ResultSummary>
  >("summary", {
    id: studentId!,
  });

  if (isLoading) {
    return (
      <Card elevation={0} sx={{mb: 3, borderRadius: 4, p: 3}}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Box>
      <Card sx={{mb: 3, boxShadow: 3, borderRadius: 2}}>
        <CardContent data-testid="global-summary-card">
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
                  <Typography
                    variant="h4"
                    sx={{fontWeight: "bold"}}
                    data-testid="global-summary-weighted-average"
                  >
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
                          <WorkspacePremium
                            sx={{fontSize: 30, color: "success.main"}}
                          />
                        );
                      } else if (ratio >= 0.5) {
                        return (
                          <MilitaryTech
                            sx={{fontSize: 30, color: "info.main"}}
                          />
                        );
                      } else if (ratio > 0) {
                        return (
                          <TrendingUp
                            sx={{fontSize: 30, color: "warning.main"}}
                          />
                        );
                      } else {
                        return (
                          <DoNotDisturbOn
                            sx={{fontSize: 30, color: "error.main"}}
                          />
                        );
                      }
                    })()}
                  </Box>
                </Box>
                <Box>
                  <Typography fontWeight={"bold"}>Crédits Obtenus</Typography>
                  <Typography
                    variant="h4"
                    sx={{fontWeight: "bold"}}
                    data-testid="global-summary-obtained-credits"
                  >
                    {summary_result?.obtained_credits
                      ? summary_result?.obtained_credits
                      : 0}
                    / 180
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
                        <Verified
                          sx={{fontSize: 40, mr: 2, color: "success.main"}}
                        />
                      );
                    case "IN_PROGRESS":
                      return (
                        <Autorenew
                          sx={{fontSize: 40, mr: 2, color: "warning.main"}}
                        />
                      );
                    case "INVALIDATED":
                      return (
                        <Block
                          sx={{fontSize: 40, mr: 2, color: "error.main"}}
                        />
                      );
                    default:
                      return (
                        <HourglassDisabled
                          sx={{fontSize: 40, mr: 2, color: "grey.500"}}
                        />
                      );
                  }
                })()}
                <Box>
                  <Typography fontWeight={"bold"}>Statut</Typography>
                  <StatusChips
                    data-testid="global-summary-status-chip"
                    variant="filled"
                    status={summary_result?.status!}
                    label={getCourseStatusLabel(
                      summary_result?.status || "NOT_STARTED"
                    )}
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
      <Typography variant="h5" sx={{mb: 2, fontWeight: "bold"}}>
        Parcours Académique
      </Typography>
      <ResultSummaryTimeline
        yearlyResult={summary_result?.yearly_results || []}
      />
    </Box>
  );
};
