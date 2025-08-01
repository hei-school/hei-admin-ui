import {Visibility} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {FC} from "react";

interface ExamCardProps {
  dateExam: string;
  refCours: string;
  groupes: string[];
  avancement: number;
}

export const ExamItem: FC<ExamCardProps> = ({
  dateExam,
  refCours,
  groupes,
  avancement,
}) => {
  return (
    <Card sx={{"mb": 2, "&:hover": {boxShadow: 4}}}>
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr 2fr 2fr 1fr"},
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Date
            </Typography>
            <Typography variant="body1" color="primary" fontWeight="bold">
              {dateExam}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Cours
            </Typography>
            <Chip
              label={refCours}
              color="secondary"
              variant="filled"
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Groupes
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {groupes.map((groupe, index) => (
                <Chip
                  key={index}
                  label={groupe}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Avancement
            </Typography>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <Box sx={{flexGrow: 1}}>
                <LinearProgress
                  variant="determinate"
                  value={avancement}
                  sx={{height: 8, borderRadius: 4}}
                />
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {avancement}%
              </Typography>
            </Box>
          </Box>
          <Box sx={{display: "flex", justifyContent: "flex-end"}}>
            <Button variant="outlined" size="small" startIcon={<Visibility />}>
              Voir détails
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
