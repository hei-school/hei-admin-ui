import {PALETTE_COLORS} from "@/haTheme";
import {RetakeExamCourseList} from "@/operations/retakeExamParticipant/RetakeExamCourseList";
import {EMPTY_TEXT} from "@/ui/constants";
import {Event as CalendarIcon} from "@mui/icons-material";
import {Box, useMediaQuery} from "@mui/material";
import {CodeIcon} from "lucide-react";
import {Show, SimpleShowLayout, TextField} from "react-admin";
import {useParams} from "react-router-dom";
import {DateField, FieldLabel} from "../common/components/fields";

const styleSx = (isSmall: boolean) => ({
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

export const RetakeExamSessionShow = () => {
  const sessionId = useParams()?.id;
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box>
      <Show
        id={sessionId}
        title="Détails de la session"
        resource="retakeExams-sessions"
      >
        <SimpleShowLayout sx={styleSx(isSmall)}>
          <TextField
            source="title"
            label={<FieldLabel icon={<CodeIcon />}>Session</FieldLabel>}
            emptyText={EMPTY_TEXT}
            sx={{fontFamily: "Inter, Arial", fontWeight: 500}}
          />
          <DateField
            source="date_from"
            label={
              <FieldLabel icon={<CalendarIcon />}>Date du début</FieldLabel>
            }
            emptyText={EMPTY_TEXT}
            sx={{fontFamily: "Inter, Arial", fontWeight: 500}}
          />
          <DateField
            source="date_to"
            label={<FieldLabel icon={<CalendarIcon />}>Date de fin</FieldLabel>}
            emptyText={EMPTY_TEXT}
            sx={{fontFamily: "Inter, Arial", fontWeight: 500}}
          />
        </SimpleShowLayout>
      </Show>

      <RetakeExamCourseList />
    </Box>
  );
};
