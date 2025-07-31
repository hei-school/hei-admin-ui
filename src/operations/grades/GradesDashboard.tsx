import {Download} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {FC} from "react";
import {Button} from "react-admin";
import {CoursesListView} from "./components/CoursesListView";
import {TranscriptOverview} from "./components/TranscriptOverview";
import {useParams} from "react-router-dom";


export const GradesOverview: FC = () => {
  const {id: studentId} = useParams();

  return (
    <Box sx={{p: 3}}>
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            sx={{fontWeight: "bold", color: "primary.main", fontSize: "2rem"}}
          >
            Tableau de Bord des Notes
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{
              padding: "0.5rem 1rem",
            }}
            startIcon={<Download />}
            onClick={() => null}
            label="Télécharger le relevé"
          />
        </Box>
        <TranscriptOverview studentLevel="L1" studentId={studentId!} />
      </Box>
    </Box>
  );
};
