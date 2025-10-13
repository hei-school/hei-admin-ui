import {Box, useMediaQuery} from "@mui/material";
import {Show} from "react-admin";
import {useParams} from "react-router-dom";
import {CourseInfo, RetakeExamParticipantList} from "./components";

export const RetakeExamParticipantShow = () => {
  const courseId = useParams()?.id;
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box sx={{padding: "1em"}}>
      <Show id={courseId} title=" " resource="course">
        <CourseInfo isSmall={isSmall} />
      </Show>
      <RetakeExamParticipantList />
    </Box>
  );
};
