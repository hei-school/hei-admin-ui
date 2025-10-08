import { PALETTE_COLORS } from "@/haTheme";
import { RetakeExamParticipantList } from "@/operations/retakeExamParticipant/components";
import { EMPTY_TEXT } from "@/ui/constants";
import {
  School as CodeIcon,
  Layers as LevelIcon,
  PermIdentity as NameIcon,
} from "@mui/icons-material";
import { Box, useMediaQuery } from "@mui/material";
import { SimpleShowLayout, TextField } from "react-admin";
import { useParams } from "react-router-dom";
import { Show } from "../common/components";
import { FieldLabel } from "../common/components/fields";

const styleSx = (isSmall: boolean) => ({
  "& .css-jfdv4h-MuiStack-root > *": {
    marginTop: "0px",
  },
  margin: "1em",
  "& .RaSimpleShowLayout-row": {
    marginBottom: "1em",
    borderColor: PALETTE_COLORS.grey,
    padding: "1.5em",
    borderRadius: "20px",
    backgroundColor: PALETTE_COLORS.primary,
    color: "white",
    flexBasis: isSmall ? "100%" : "32%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
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

export const RetakeExamParticipantShow = () => {
  const courseId = useParams()?.id;
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box sx={{ padding: "1em" }}>
      <Show id={courseId} title=" " resource="course">
        <SimpleShowLayout sx={styleSx(isSmall)}>
          <TextField
            source="code"
            label={<FieldLabel icon={<CodeIcon />}>Matière</FieldLabel>}
            emptyText={EMPTY_TEXT}
            sx={{ fontFamily: "Inter, Arial", fontWeight: 500 }}
          />
          <TextField
            source="name"
            label={<FieldLabel icon={<NameIcon />}>Nom</FieldLabel>}
            emptyText={EMPTY_TEXT}
            sx={{ fontFamily: "Inter, Arial", fontWeight: 500 }}
          />
          <TextField
            source="level"
            label={<FieldLabel icon={<LevelIcon />}>Niveau</FieldLabel>}
            emptyText={EMPTY_TEXT}
            sx={{ fontFamily: "Inter, Arial", fontWeight: 500 }}
          />
        </SimpleShowLayout>
      </Show>
      <RetakeExamParticipantList />
    </Box>
  );
};
