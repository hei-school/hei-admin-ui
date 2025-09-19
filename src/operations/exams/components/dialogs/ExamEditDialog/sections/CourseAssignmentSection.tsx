import {PALETTE_COLORS} from "@/haTheme";
import {Alert, AlertTitle, Box, Typography} from "@mui/material";
import {FC} from "react";
import {EXAM_ALERTS, EXAM_FORM_LABELS} from "../../../../utils/constants";
import {SelectCourseAssignment, SelectTeacher} from "../../../selectors";

interface CourseAssignmentSectionProps {
  isPrivileged: boolean;
  userId: string;
}

export const CourseAssignmentSection: FC<CourseAssignmentSectionProps> = ({
  isPrivileged,
  userId,
}) => {
  return (
    <Box sx={{mb: 3}}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: PALETTE_COLORS.primary,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {EXAM_FORM_LABELS.COURSE_ASSIGNMENT_SECTION}
      </Typography>
      <Alert severity="info" sx={{mb: 2}}>
        <AlertTitle>{EXAM_ALERTS.COURSE_ASSIGNMENT_INFO.title}</AlertTitle>
        {EXAM_ALERTS.COURSE_ASSIGNMENT_INFO.message}
      </Alert>
      {isPrivileged ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
          }}
        >
          <SelectTeacher isPrivileged={isPrivileged} />
          <SelectCourseAssignment />
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
          }}
        >
          <SelectCourseAssignment defaultTeacherId={userId} />
        </Box>
      )}
    </Box>
  );
};
