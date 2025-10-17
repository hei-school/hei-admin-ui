import {PALETTE_COLORS} from "@/haTheme";
import {FieldLabel} from "@/operations/common/components/fields";
import {EMPTY_TEXT} from "@/ui/constants";
import {
  School as CodeIcon,
  Layers as LevelIcon,
  PermIdentity as NameIcon,
} from "@mui/icons-material";
import {useMediaQuery} from "@mui/material";
import {useMemo} from "react";
import {
  Loading,
  SimpleShowLayout,
  TextField,
  useShowContext,
} from "react-admin";

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

export const CourseInfo = () => {
  const {isLoading, error, record: course} = useShowContext();
  const isSmall = useMediaQuery("(max-width:900px)");

  const sx = useMemo(() => getShowLayoutStyle(isSmall), [isSmall]);

  if (isLoading) return <Loading />;
  if (error) return <>Erreur lors du chargement des informations du cours.</>;
  if (!course) return <>Aucune information sur le cours disponible.</>;

  return (
    <SimpleShowLayout sx={sx} record={course}>
      <TextField
        source="code"
        label={<FieldLabel icon={<CodeIcon />}>Matière</FieldLabel>}
        {...commonTextFieldProps}
      />
      <TextField
        source="name"
        label={<FieldLabel icon={<NameIcon />}>Nom</FieldLabel>}
        {...commonTextFieldProps}
      />
      <TextField
        source="level"
        label={<FieldLabel icon={<LevelIcon />}>Niveau</FieldLabel>}
        {...commonTextFieldProps}
      />
    </SimpleShowLayout>
  );
};
