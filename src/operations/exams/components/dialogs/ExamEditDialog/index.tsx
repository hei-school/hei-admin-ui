import {PALETTE_COLORS} from "@/haTheme";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {Exam} from "@haapi-b0fc7615/typescript-client";
import {
  Close as CloseIcon,
  EditOutlined as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {FC} from "react";
import {Form} from "react-admin";
import {useExamEdit} from "../../../hooks/useExamEdit";
import {CoefficientSection} from "./sections/CoefficientSection";
import {CourseAssignmentSection} from "./sections/CourseAssignmentSection";
import {ExamDetailsSection} from "./sections/ExamDetailsSection";

interface ExamEditDialogProps {
  open: boolean;
  onClose: () => void;
  exam: Exam;
}

export const ExamEditDialog: FC<ExamEditDialogProps> = ({
  open,
  onClose,
  exam,
}) => {
  const {id: userId} = authProvider.getCachedWhoami();
  const {isManager, isAdmin} = useRole();
  const isPrivileged = isManager() || isAdmin();

  const {handleSubmit, isSubmitting} = useExamEdit({exam, onClose});

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "visible",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${PALETTE_COLORS.primary} 0%, ${PALETTE_COLORS.yellow} 100%)`,
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
          <EditIcon sx={{fontSize: 32}} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Modifier l'examen
            </Typography>
            <Typography variant="body2" sx={{opacity: 0.9}}>
              {exam?.title || "Chargement..."}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            "color": "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{p: 0}}>
        <Form
          key={exam?.id}
          record={exam}
          onSubmit={handleSubmit}
          mode="onSubmit"
        >
          <Box sx={{p: 3}}>
            <CourseAssignmentSection
              isPrivileged={isPrivileged}
              userId={userId!}
            />
            <Divider sx={{my: 3}} />
            <ExamDetailsSection />
            <Divider sx={{my: 3}} />
            <CoefficientSection exam={exam} />
          </Box>
          <DialogActions
            sx={{
              p: 3,
              bgcolor: "grey.50",
              gap: 2,
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                "borderColor": PALETTE_COLORS.grey,
                "color": PALETTE_COLORS.primary,
                "&:hover": {
                  borderColor: PALETTE_COLORS.primary,
                  bgcolor: "rgba(0, 25, 72, 0.04)",
                },
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={<SaveIcon />}
              sx={{
                "bgcolor": PALETTE_COLORS.primary,
                "&:hover": {
                  bgcolor: PALETTE_COLORS.yellow,
                },
              }}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
