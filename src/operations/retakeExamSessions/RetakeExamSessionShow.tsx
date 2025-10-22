import {PALETTE_COLORS} from "@/haTheme";
import {DateField, FieldLabel} from "@/operations/common/components/fields";
import {RetakeExamCourseList} from "@/operations/retakeExamParticipants/RetakeExamCourseList";
import {EMPTY_TEXT} from "@/ui/constants";
import {Event as CalendarIcon} from "@mui/icons-material";
import {Box, Breadcrumbs, Link, Typography, useMediaQuery} from "@mui/material";
import {CodeIcon} from "lucide-react";
import {Show, SimpleShowLayout, TextField} from "react-admin";
import {Link as RouterLink, useParams} from "react-router-dom";

const getShowLayoutStyle = (isSmall: boolean) => ({
  "& .css-jfdv4h-MuiStack-root > *": {marginTop: "0px"},
  "margin": "1em",
  "& .RaSimpleShowLayout-row": {
    "marginBottom": "1em",
    "borderColor": PALETTE_COLORS.grey,
    "padding": "1.5em",
    "borderRadius": "20px",
    "backgroundColor": PALETTE_COLORS.primary,
    "color": "white",
    "flexBasis": isSmall ? "100%" : "32%",
    "boxShadow": "0 4px 10px rgba(0,0,0,0.15)",
    "transition": "transform 0.2s ease-in-out",
    "&:hover": {transform: "scale(1.02)"},
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

export const RetakeExamSessionShow = () => {
  const sessionId = useParams()?.id;
  const isSmall = useMediaQuery("(max-width:900px)");
  return (
    <Box>
      <Box sx={{px: 2, mt: 2}}>
        <Breadcrumbs sx={{mb: 2}}>
          <Link component={RouterLink} to="/retakeExams-sessions">
            Sessions de rattrapage
          </Link>
          <Typography color="text.primary">Matières à rattraper</Typography>
        </Breadcrumbs>
      </Box>
      <Show
        id={sessionId}
        title="Détails de la session"
        resource="retakeExams-sessions"
      >
        <SimpleShowLayout sx={getShowLayoutStyle(isSmall)}>
          <TextField
            source="title"
            label={<FieldLabel icon={<CodeIcon />}>Session</FieldLabel>}
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
