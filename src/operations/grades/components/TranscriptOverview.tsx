import {getGradeColor} from "@/operations/grades/utils/getGradeColor";
import {StudentLevel} from "@haapi/typescript-client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {FC} from "react";
import {useGetOne} from "react-admin";
import {getStatusChipProps} from "../utils/getStatusChipProps";

import {School} from "@mui/icons-material";
export const TranscriptOverview: FC<{
  studentLevel: StudentLevel;
  studentId: string;
}> = ({studentId, studentLevel}) => {
  const {data: result} = useGetOne("grades", {
    id: studentId,
    meta: {
      studentLevel,
    },
  });

  const chipProps = getStatusChipProps(result?.status || "NOT_STARTED");

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: 4,
        position: "relative",
        background: "#f0f2f5",
        border: "1px solid #e0e2e5",
        boxShadow: "8px 8px 16px #d9dbde, -8px -8px 16px #ffffff",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{position: "relative", zIndex: 1, p: 3}}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  background: "white",
                  boxShadow:
                    "inset 4px 4px 8px #d9dbde, inset -4px -4px 8px #ffffff",
                  mr: 2,
                }}
              >
                <School sx={{fontSize: 32, color: "primary.main"}} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{fontWeight: "bold", color: "text.primary"}}
                >
                  Moyenne Générale
                </Typography>
                <Typography variant="body2" sx={{color: "text.secondary"}}>
                  Niveau {result?.level}
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={chipProps.icon}
              label={chipProps.label}
              size="small"
              color={chipProps.color}
              variant={chipProps.variant}
              sx={{mb: 2, fontWeight: "medium"}}
            />

            <Box
              sx={{
                mt: 2,
                pl: 1,
                borderLeft: "3px solid",
                borderColor: getGradeColor(result?.weighted_average!),
                paddingLeft: 2,
              }}
            >
              <Divider sx={{my: 1}} />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1" color="text.secondary">
                  Crédits ECTS
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {result?.obtained_credits}{" "}
                  <span style={{fontSize: "0.8rem", color: "#666"}}>
                    / {result?.total_credits}
                  </span>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{position: "relative", width: 170, height: 170}}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
                  boxShadow:
                    "inset 6px 6px 12px #cccccc, inset -6px -6px 12px #ffffff",
                }}
              />
              <CircularProgress
                variant="determinate"
                value={(result?.weighted_average! / 20) * 100}
                size={170}
                thickness={5}
                sx={{
                  color: getGradeColor(result?.weighted_average!),
                  position: "absolute",
                  top: 0,
                  left: 0,
                  circle: {
                    strokeLinecap: "round",
                    filter: `drop-shadow(0 0 4px ${getGradeColor(result?.weighted_average!)}90)`,
                  },
                  transition: "transform 0.5s ease-in-out",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  {result?.weighted_average ? result?.weighted_average : "0"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  / 20
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
