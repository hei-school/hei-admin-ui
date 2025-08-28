import {PALETTE_COLORS} from "@/haTheme";
import {Box, Chip, Typography} from "@mui/material";
import {InfoIcon} from "lucide-react";
import {Exam} from "../typess";

interface ExamHeaderProps {
  exam: Exam;
}

export const ExamHeader = ({exam}: ExamHeaderProps) => (
  <Box
    display="flex"
    borderRadius="20px 20px 0 0"
    justifyContent="space-between"
    px={5}
    pt={5}
    pb={5}
    bgcolor={PALETTE_COLORS.yellow}
  >
    <Typography
      variant="h5"
      display="flex"
      alignItems="center"
      fontWeight="bolder"
      gap={2}
    >
      <InfoIcon />
      Détails de l'examen {exam.title}
    </Typography>
    <Chip
      label={`Coef. ${exam.coefficient}`}
      sx={{
        py: "3px",
        fontSize: "14px",
        fontWeight: "bold",
        bgcolor: PALETTE_COLORS.white,
        borderRadius: 20,
        minWidth: "fit-content",
      }}
    />
  </Box>
);
