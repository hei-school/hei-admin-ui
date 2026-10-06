import {InfoOutlined} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";

export const ExamLoadError = () => (
  <Box
    sx={{
      padding: 3,
      backgroundColor: "background.paper",
      borderRadius: 1,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <InfoOutlined sx={{color: "text.secondary"}} />
    <Box>
      <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
        Erreur
      </Typography>
      <Typography variant="body2" sx={{color: "text.secondary"}}>
        Impossible de charger les informations de l'examen.
      </Typography>
    </Box>
  </Box>
);
