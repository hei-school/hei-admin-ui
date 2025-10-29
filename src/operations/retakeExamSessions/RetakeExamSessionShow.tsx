import {PALETTE_COLORS} from "@/haTheme";
import {DateField, FieldLabel} from "@/operations/common/components/fields";
import {EMPTY_TEXT} from "@/ui/constants";
import {Event as CalendarIcon} from "@mui/icons-material";
import {Box, useMediaQuery} from "@mui/material";
import {Calendar, CodeIcon, Home} from "lucide-react";
import {useMemo} from "react";
import {Show, SimpleShowLayout, TextField} from "react-admin";
import {Link as RouterLink, useParams} from "react-router-dom";
import {RetakeExamCourseList} from "../retakeExamCourses/retakeExamCourseList";
import {CustomBreadcrumbs} from "../utils/CustomBreadcrumbs";

const containerSx = {minHeight: "100vh", pb: 4, bgcolor: "#f8fafc"};
const headerSx = {px: 2, pt: 2, pb: 1, borderBottom: "1px solid #e2e8f0"};

const getShowLayoutStyle = (isSmall: boolean) => ({
  "& .css-jfdv4h-MuiStack-root > *": {marginTop: "0px"},
  "margin": "1em",
  "& .RaSimpleShowLayout-row": {
    "marginBottom": "1em",
    "borderColor": PALETTE_COLORS.grey,
    "padding": "1.5em",
    "borderRadius": "16px",
    "backgroundColor": PALETTE_COLORS.primary,
    "color": "white",
    "flexBasis": isSmall ? "100%" : "32%",
    "boxShadow": "0 4px 12px rgba(0,0,0,0.1)",
    "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-4px) scale(1.01)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    },
  },
  "& .RaSimpleShowLayout-stack": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1em",
  },
});

const commonTextFieldProps = {
  sx: {fontFamily: "Inter, Arial", fontWeight: 500},
  emptyText: EMPTY_TEXT,
};

const breadcrumbItems = [
  {
    label: "Sessions de rattrapage",
    href: "/retakeExams-sessions",
    component: RouterLink,
    to: "/retakeExams-sessions",
    icon: <Home size={16} />,
  },
  {
    label: "Matières à rattraper",
    isActive: true,
    icon: <Calendar size={16} />,
  },
];

export const RetakeExamSessionShow = () => {
  const {id: sessionId} = useParams();
  const isSmall = useMediaQuery("(max-width:900px)");
  const showLayoutStyle = useMemo(() => getShowLayoutStyle(isSmall), [isSmall]);
  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <CustomBreadcrumbs
          items={breadcrumbItems}
          sx={{mb: 2}}
          variant="default"
        />
      </Box>
      <Show
        id={sessionId}
        title="Détails de la session"
        resource="retakeExams-sessions"
      >
        <SimpleShowLayout sx={showLayoutStyle}>
          <TextField
            source="title"
            label={
              <FieldLabel icon={<CodeIcon size={18} />}>Session</FieldLabel>
            }
            {...commonTextFieldProps}
          />
          <DateField
            source="date_from"
            label={
              <FieldLabel icon={<CalendarIcon />}>Date du début</FieldLabel>
            }
            {...commonTextFieldProps}
          />
          <DateField
            source="date_to"
            label={<FieldLabel icon={<CalendarIcon />}>Date de fin</FieldLabel>}
            {...commonTextFieldProps}
          />
        </SimpleShowLayout>
      </Show>
      <RetakeExamCourseList />
    </Box>
  );
};
