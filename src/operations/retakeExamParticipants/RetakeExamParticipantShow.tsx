import {Box} from "@mui/material";
import {BookOpen, Home, ListChecks} from "lucide-react";
import {useMemo} from "react";
import {Show} from "react-admin";
import {Link as RouterLink, useLocation, useParams} from "react-router-dom";
import {CustomBreadcrumbs} from "../utils/CustomBreadcrumbs";
import {CourseInfo, RetakeExamParticipantList} from "./components";

const containerSx = {minHeight: "100vh", pb: 4, bgcolor: "#f8fafc"};
const headerSx = {px: 2, pt: 2, pb: 1, borderBottom: "1px solid #e2e8f0"};
const contentSx = {px: 2, pt: 3};

export const RetakeExamParticipantShow = () => {
  const {id: courseId} = useParams();
  const {state} = useLocation();
  const sessionId = state?.sessionId;

  const breadcrumbItems = useMemo(() => {
    const baseItems = [
      {
        label: "Sessions de rattrapage",
        href: "/retakeExams-sessions",
        component: RouterLink,
        to: "/retakeExams-sessions",
        icon: <Home size={16} />,
      },
    ];

    const sessionItem = sessionId
      ? {
          label: "Matières à rattraper",
          href: `/retakeExams-sessions/${sessionId}/show`,
          component: RouterLink,
          to: `/retakeExams-sessions/${sessionId}/show`,
          icon: <ListChecks size={16} />,
        }
      : {
          label: "Matières à rattraper",
          icon: <ListChecks size={16} />,
        };

    return [
      ...baseItems,
      sessionItem,
      {
        label: "Détails du cours",
        isActive: true,
        icon: <BookOpen size={16} />,
      },
    ];
  }, [sessionId]);

  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <CustomBreadcrumbs
          items={breadcrumbItems}
          sx={{mb: 2}}
          variant="default"
        />
      </Box>

      <Box sx={contentSx}>
        <Show id={courseId} title=" " resource="course">
          <CourseInfo />
        </Show>
        <RetakeExamParticipantList />
      </Box>
    </Box>
  );
};
