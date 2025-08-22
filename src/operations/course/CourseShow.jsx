import {PALETTE_COLORS} from "@/haTheme";
import {AssignedTeachersList} from "@/operations/CourseAssignments/AssignedTeachersList";
import {Show} from "@/operations/common/components";
import {
  AccessTime as AccessTimeIcon,
  MenuBook as BookIcon,
  Code as CodeIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {SimpleShowLayout, TextField} from "react-admin";
import {useParams} from "react-router-dom";

const LabeledIconField = ({
  icon: Icon,
  label,
  source,
  iconColor = "inherit",
}) => (
  <Box mb={2} sx={{width: "48%"}}>
    <Icon sx={{marginRight: 1, color: iconColor}} />
    <Box sx={{display: "flex", flexDirection: "column"}}>
      <Typography sx={{marginBottom: "0.5em"}}>{label}</Typography>
      <TextField
        sx={{
          border: "solid 1px",
          borderColor: PALETTE_COLORS.grey,
          padding: "8px",
          borderRadius: "5px",
          color: "grey",
        }}
        source={source}
      />
    </Box>
  </Box>
);

function CourseShow() {
  const {id} = useParams();

  return (
    <Box>
      <Show title="Cours">
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            padding: 4,
            paddingBottom: 2,
          }}
        >
          Détails d'un cours
        </Typography>
        <SimpleShowLayout
          sx={{
            padding: 4,
            paddingTop: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <LabeledIconField
              icon={CodeIcon}
              label="Code"
              source="code"
              iconColor="blue"
            />

            <LabeledIconField
              icon={BookIcon}
              label="Nom"
              source="name"
              iconColor="green"
            />
            <LabeledIconField
              icon={CreditCardIcon}
              label="Crédits"
              source="credits"
              iconColor="orange"
            />

            <LabeledIconField
              icon={AccessTimeIcon}
              label="Heure totale"
              source="total_hours"
              iconColor="red"
            />
          </Box>
        </SimpleShowLayout>
      </Show>
      <AssignedTeachersList courseId={id} />
    </Box>
  );
}

export default CourseShow;
