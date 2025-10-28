"use client";
import { Box } from "@mui/material";
import { BookOpen, Home, ListChecks } from "lucide-react";
import { Show } from "react-admin";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { CustomBreadcrumbs } from "../utils/CustomBreadcrumbs";
import { CourseInfo, RetakeExamParticipantList } from "./components";

export const RetakeExamParticipantShow = () => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const sessionId = location.state?.sessionId;

  const breadcrumbItems = [
    {
      label: "Sessions de rattrapage",
      href: "/retakeExams-sessions",
      component: RouterLink,
      to: "/retakeExams-sessions",
      icon: <Home size={16} />,
    },
    ...(sessionId
      ? [
        {
          label: "Matières à rattraper",
          href: `/retakeExams-sessions/${sessionId}/show`,
          component: RouterLink,
          to: `/retakeExams-sessions/${sessionId}/show`,
          icon: <ListChecks size={16} />,
        },
      ]
      : [
        {
          label: "Matières à rattraper",
          icon: <ListChecks size={16} />,
        },
      ]),
    {
      label: "Détails du cours",
      isActive: true,
      icon: <BookOpen size={16} />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", pb: 4, bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1,
          bgcolor: "white",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <CustomBreadcrumbs
          items={breadcrumbItems}
          sx={{ mb: 2 }}
          variant="default"
        />
      </Box>

      <Box sx={{ px: 2, pt: 3 }}>
        <Show id={courseId} title=" " resource="course">
          <CourseInfo />
        </Show>

        <RetakeExamParticipantList />
      </Box>
    </Box>
  );
};
