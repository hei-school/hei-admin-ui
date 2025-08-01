import {MenuBook} from "@mui/icons-material";
import {Box, Card, CardContent, Container, Typography} from "@mui/material";
import {ExamItem} from "./components";

/* Use to simulate the data that should be passed */
const exams = [
  {
    dateExam: "17/07/2025",
    refCours: "PROG1",
    groupes: ["G1", "G2", "G3", "G4"],
    avancement: 30,
  },
  {
    dateExam: "20/07/2025",
    refCours: "MATH2",
    groupes: ["G1", "G2"],
    avancement: 75,
  },
  {
    dateExam: "25/07/2025",
    refCours: "ALGO3",
    groupes: ["G3", "G4", "G5"],
    avancement: 90,
  },
];

export const MyExam = () => {
  return (
    <Box component="main" sx={{flexGrow: 1, p: 4, ml: 0}}>
      <Container maxWidth="xl">
        <Card sx={{mb: 4}}>
          <Box
            sx={{
              p: 3,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <MenuBook />
              <Typography variant="h6" component="h2">
                Mes examens
              </Typography>
            </Box>
          </Box>
          <CardContent>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
              {exams.map((item, index) => (
                <ExamItem
                  key={index}
                  dateExam={item.dateExam}
                  refCours={item.refCours}
                  groupes={item.groupes}
                  avancement={item.avancement}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
