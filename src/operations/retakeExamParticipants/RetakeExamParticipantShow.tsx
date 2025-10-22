import {Box, Breadcrumbs, Link, Typography} from "@mui/material";
import {Show} from "react-admin";
import {Link as RouterLink, useLocation, useParams} from "react-router-dom";
import {CourseInfo, RetakeExamParticipantList} from "./components";

export const RetakeExamParticipantShow = () => {
  const {id: courseId} = useParams();
  const location = useLocation();
  const sessionId = (location.state as {sessionId?: string})?.sessionId;
  return (
    <Box sx={{padding: "1em"}}>
      <Breadcrumbs sx={{mb: 2}}>
        <Link component={RouterLink} to="/retakeExams-sessions">
          Sessions de rattrapage
        </Link>
        {sessionId ? (
          <Link
            component={RouterLink}
            to={`/retakeExams-sessions/${sessionId}/show`}
          >
            Matières à rattraper
          </Link>
        ) : (
          <Typography color="text.secondary">Matières à rattraper</Typography>
        )}
        <Typography color="text.primary">Détails du cours</Typography>
      </Breadcrumbs>

      <Show id={courseId} title=" " resource="course">
        <CourseInfo />
      </Show>
      <RetakeExamParticipantList />
    </Box>
  );
};
