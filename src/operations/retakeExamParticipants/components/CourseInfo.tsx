import {PALETTE_COLORS} from "@/haTheme";
import {FieldLabel} from "@/operations/common/components/fields";
import {EMPTY_TEXT} from "@/ui/constants";
import {
  School as CodeIcon,
  Layers as LevelIcon,
  PermIdentity as NameIcon,
} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {
  Loading,
  SimpleShowLayout,
  TextField,
  useRecordContext,
  useShowContext,
} from "react-admin";

type CourseInfoProps = {
  isSmall: boolean;
};

const getStyleSx = (isSmall: boolean) => ({
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

export const CourseInfo = ({isSmall}: CourseInfoProps) => {
  const {isLoading, error} = useShowContext();
  const course = useRecordContext();

  if (isLoading) return <Loading />;
  if (error)
    return (
      <Box p={2}>
        <Typography color="error">
          Erreur lors du chargement des informations du cours.
        </Typography>
      </Box>
    );
  if (!course) return <>Aucune information sur le cours disponible.</>;

  return (
    <SimpleShowLayout sx={getStyleSx(isSmall)} record={course}>
      <TextField
        source="code"
        label={<FieldLabel icon={<CodeIcon />}>Matière</FieldLabel>}
        emptyText={EMPTY_TEXT}
        sx={{fontFamily: "Inter, Arial", fontWeight: 500}}
      />
      <TextField
        source="name"
        label={<FieldLabel icon={<NameIcon />}>Nom</FieldLabel>}
        emptyText={EMPTY_TEXT}
        sx={{fontFamily: "Inter, Arial", fontWeight: 500}}
      />
      <TextField
        source="level"
        label={<FieldLabel icon={<LevelIcon />}>Niveau</FieldLabel>}
        emptyText={EMPTY_TEXT}
        sx={{fontFamily: "Inter, Arial", fontWeight: 500}}
      />
    </SimpleShowLayout>
  );
};
