import {Box} from "@mui/material";
import {Show} from "react-admin";
import {useParams} from "react-router-dom";
import {CourseInfo, RetakeExamParticipantList} from "./components";

export const RetakeExamParticipantShow = () => {
  const courseId = useParams()?.id;
  return (
    <Box sx={{padding: "1em"}}>
      <Show id={courseId} title=" " resource="course">
        <CourseInfo />
      </Show>
      <RetakeExamParticipantList />
    </Box>
  );
};
