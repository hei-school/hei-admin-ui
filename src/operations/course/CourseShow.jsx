import {Button, SimpleShowLayout, TextField} from "react-admin";
import {Dialog, DialogTitle, DialogContent, IconButton} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";
import {PALETTE_COLORS} from "@/haTheme";
import {Create as EditIcon} from "@mui/icons-material";
import {Show} from "@/operations/common/components";
import {useToggle} from "@/hooks";

export const CourseShowDialog = ({courseId}) => {
  const [showDetails, toggleShowDetails] = useToggle();
  return (
    <>
      <Button
        onClick={toggleShowDetails}
        startIcon={<EditIcon />}
        label="AFFICHER"
        variant="text"
        sx={{py: "5px"}}
      />
      <Dialog open={showDetails} onClose={toggleShowDetails}>
        <DialogTitle
          variant="h2"
          sx={{
            backgroundColor: PALETTE_COLORS.primary,
            color: PALETTE_COLORS.white,
            fontSize: "20px",
          }}
        >
          Details d'un cours
          <IconButton
            sx={{
              color: PALETTE_COLORS.white,
              m: 0,
              ml: 6,
              borderRadius: "50%",
            }}
            onClick={() => toggleShowDetails()}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            "& .RaShow-card": {
              border: "solid 1px",
              borderColor: PALETTE_COLORS.grey,
              boxShadow: "0",
            },
          }}
        >
          <CourseShow id={courseId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

function CourseShow({id}) {
  return (
    <Show title="Cours" id={id}>
      <SimpleShowLayout>
        <TextField source="code" label="Code" />
        <TextField source="name" label="Nom" />
        <TextField source="credits" label="Crédits" />
        <TextField source="total_hours" label="Heure totale" />
      </SimpleShowLayout>
    </Show>
  );
}

export default CourseShow;
