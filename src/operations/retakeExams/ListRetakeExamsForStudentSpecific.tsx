import authProvider from "@/providers/authProvider";
import {
  CourseResult,
  CourseResultStatus,
  StudentLevel,
} from "@haapi-3d601c85/typescript-client";
import {
  AutoStoriesOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  SchoolOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {useGetList} from "react-admin";
import {useNavigate} from "react-router-dom";

type RetakeExamRecord = CourseResult & {
  id: string;
  weighted_average: number | null;
  status: CourseResultStatus;
};

const getAverageColor = (avg: number | null): string => {
  if (avg === null) return "#94A3B8";
  if (avg >= 10) return "#10B981";
  if (avg >= 7) return "#F59E0B";
  return "#EF4444";
};

const getAverageLabel = (avg: number | null): string => {
  if (avg === null) return "Non noté";
  if (avg >= 10) return "Admis";
  if (avg >= 7) return "Limite";
  return "Insuffisant";
};

const formatLevel = (level: StudentLevel | undefined): string =>
  level ? level.toString() : "—";

const getInitials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

interface GlobalProgressBarProps {
  total: number;
  validated: number;
}

const GlobalProgressBar = ({total, validated}: GlobalProgressBarProps) => {
  const progress = total > 0 ? (validated / total) * 100 : 0;
  const remaining = total - validated;

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        bgcolor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{color: "rgba(255,255,255,0.45)", display: "block", mb: 0.25}}
          >
            Progression des rattrapages
          </Typography>
          <Typography
            variant="body2"
            sx={{color: "rgba(255,255,255,0.85)", fontWeight: 600}}
          >
            {validated} validé{validated > 1 ? "s" : ""} sur {total} cours
          </Typography>
        </Box>

        <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
          <Box sx={{textAlign: "center"}}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{color: "#FCA5A5", lineHeight: 1}}
            >
              {remaining}
            </Typography>
            <Typography variant="caption" sx={{color: "rgba(255,255,255,0.4)"}}>
              restant{remaining > 1 ? "s" : ""}
            </Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{borderColor: "rgba(255,255,255,0.1)"}}
          />
          <Box sx={{textAlign: "center"}}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{color: "#86EFAC", lineHeight: 1}}
            >
              {validated}
            </Typography>
            <Typography variant="caption" sx={{color: "rgba(255,255,255,0.4)"}}>
              validé{validated > 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Barre */}
      <Box sx={{position: "relative"}}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            "height": 10,
            "borderRadius": 99,
            "bgcolor": "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": {
              bgcolor: validated === total && total > 0 ? "#86EFAC" : "#A5B4FC",
              borderRadius: 99,
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            right: 0,
            top: 14,
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.7rem",
          }}
        >
          {Math.round(progress)}%
        </Typography>
      </Box>
    </Box>
  );
};

interface RetakeCardProps {
  record: RetakeExamRecord;
}

const RetakeCard = ({record}: RetakeCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const avg = record.weighted_average;
  const color = getAverageColor(avg);
  const label = getAverageLabel(avg);
  const progress = avg !== null ? (avg / 20) * 100 : 0;
  const courseName = record.course?.name ?? "Cours inconnu";
  const level = formatLevel(record.course?.level);

  return (
    <Card
      elevation={0}
      sx={{
        "border": "1px solid #E2E8F0",
        "borderRadius": 3,
        "overflow": "hidden",
        "bgcolor": "#FFFFFF",
        "transition": "box-shadow 0.2s, transform 0.15s",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{height: 4, bgcolor: color}} />

      <CardActionArea onClick={() => setExpanded((prev) => !prev)}>
        <CardContent sx={{"p": 2.5, "&:last-child": {pb: 2.5}}}>
          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: `${color}12`,
                border: `1.5px solid ${color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.9rem",
                color,
                flexShrink: 0,
              }}
            >
              {getInitials(courseName)}
            </Box>

            <Box sx={{flex: 1, minWidth: 0}}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                noWrap
                title={courseName}
                sx={{color: "#0F172A"}}
              >
                {courseName}
              </Typography>
              <Box
                sx={{display: "flex", alignItems: "center", gap: 0.5, mt: 0.25}}
              >
                <SchoolOutlined sx={{fontSize: 12, color: "#94A3B8"}} />
                <Typography variant="caption" sx={{color: "#94A3B8"}}>
                  {level}
                </Typography>
              </Box>
            </Box>

            <Box sx={{textAlign: "right", flexShrink: 0, mr: 1}}>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{color, lineHeight: 1}}
              >
                {avg !== null ? avg.toFixed(1) : "—"}
              </Typography>
              <Typography variant="caption" sx={{color: "#CBD5E1"}}>
                / 20
              </Typography>
            </Box>

            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                flexShrink: 0,
              }}
            >
              {expanded ? (
                <ExpandLessOutlined fontSize="small" />
              ) : (
                <ExpandMoreOutlined fontSize="small" />
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{borderColor: "#F1F5F9"}} />
        <Box sx={{p: 2.5, bgcolor: "#F8FAFC"}}>
          <Box sx={{mb: 2.5}}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{color: "#64748B", fontWeight: 500}}
              >
                Moyenne pondérée
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{color}}>
                {avg !== null ? `${avg.toFixed(2)} / 20` : "—"}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                "height": 7,
                "borderRadius": 99,
                "bgcolor": `${color}18`,
                "& .MuiLinearProgress-bar": {
                  bgcolor: color,
                  borderRadius: 99,
                },
              }}
            />
          </Box>

          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography variant="caption" sx={{color: "#94A3B8"}}>
                  Niveau
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{mt: 0.25, color: "#0F172A"}}
                >
                  {level}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography variant="caption" sx={{color: "#94A3B8"}}>
                  Statut
                </Typography>
                <Chip
                  label={label}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: `${color}12`,
                    color,
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: 22,
                    border: `1px solid ${color}30`,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Card>
  );
};

const EmptyState = () => (
  <Box
    sx={{
      py: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <WarningAmberOutlined sx={{fontSize: 48, color: "#CBD5E1"}} />
    <Typography variant="h6" sx={{color: "#64748B"}} fontWeight={600}>
      Aucun rattrapage trouvé
    </Typography>
    <Typography variant="body2" sx={{color: "#94A3B8"}}>
      Tous vos cours sont validés.
    </Typography>
  </Box>
);

export const ListRetakeExamsForStudentSpecific = () => {
  const studentId = authProvider.getCachedWhoami().id;
  const navigate = useNavigate();

  const {data, isLoading} = useGetList<RetakeExamRecord>(
    "student-retake-exams",
    {
      filter: {studentId, status: CourseResultStatus.INCOMPLETE},
    },
    {
      onSuccess: ({data: result}) => {
        if (result.length === 0) navigate("/student/retake-exams");
      },
    }
  );

  const courseList = data ?? [];

  const validated = courseList.filter(
    (r) => r.weighted_average !== null && r.weighted_average >= 10
  ).length;

  return (
    <Box sx={{width: "100%", minHeight: "100vh", bgcolor: "#F1F5F9"}}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #1E3A5F 0%, #0F2744 100%)",
          px: {xs: 3, md: 4},
          pt: 4,
          pb: 5,
        }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mb: 0.75}}>
          <AutoStoriesOutlined sx={{color: "#FB923C", fontSize: 30}} />
          <Typography
            variant="h5"
            fontWeight={800}
            letterSpacing="-0.3px"
            sx={{color: "#F8FAFC"}}
          >
            Rattrapages à faire
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{color: "rgba(255,255,255,0.45)", mb: 3}}
        >
          Cours incomplets nécessitant un examen de rattrapage.
        </Typography>

        {!isLoading && courseList.length > 0 && (
          <GlobalProgressBar total={courseList.length} validated={validated} />
        )}
      </Box>
      <Box
        sx={{
          bgcolor: "#F1F5F9",
          borderRadius: "24px 24px 0 0",
          mt: -2,
          px: {xs: 3, md: 4},
          pt: 3,
          pb: 6,
        }}
      >
        {isLoading ? (
          <Box sx={{display: "flex", justifyContent: "center", py: 10}}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        ) : courseList.length === 0 ? (
          <EmptyState />
        ) : (
          <Grid container spacing={2}>
            {courseList.map((record) => (
              <Grid item xs={12} sm={6} xl={4} key={record.id}>
                <RetakeCard record={record} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
