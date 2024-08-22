import { SimpleShowLayout, TextField } from "react-admin";
import { Show } from "../common/components/Show";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { PALETTE_COLORS } from "@/haTheme";

export const CourseShowDialog = ({ open, onClose, courseId }: any) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle
          variant="h2"
          sx={{
            backgroundColor: PALETTE_COLORS.primary,
            color: PALETTE_COLORS.white,
            fontSize: "20px"
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
            onClick={() => onClose()}
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
            }
          }}
        >
          <CourseShow id={courseId} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function CourseShow({ id }: any) {
  return (
    <Show
      title="Cours"
      id={id}
    >
      <SimpleShowLayout>
        <TextField source="code" label="Code" />
        <TextField source="name" label="Nom" />
        <TextField source="credits" label="Crédits" />
        <TextField source="total_hours" label="Heure totale" />
      </SimpleShowLayout>
    </Show>
  )
}

export default CourseShow;
