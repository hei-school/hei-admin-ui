import {PALETTE_COLORS} from "@/haTheme";
import {Exam} from "@haapi-b0fc7615/typescript-client";
import {Alert, AlertTitle, Box, Typography} from "@mui/material";
import {FC} from "react";
import {NumberInput, required} from "react-admin";
import {EXAM_ALERTS, EXAM_FORM_LABELS} from "../../../../utils/constants";
import {
  validateCoefficientDenominator,
  validateCoefficientNumerator,
} from "../../../../utils/validation";

interface CoefficientSectionProps {
  exam: Exam;
}

export const CoefficientSection: FC<CoefficientSectionProps> = ({exam}) => {
  return (
    <Box sx={{mb: 3}}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: PALETTE_COLORS.primary,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {EXAM_FORM_LABELS.COEFFICIENT_SECTION}
      </Typography>
      <Alert severity="warning" sx={{mb: 2}}>
        <AlertTitle>{EXAM_ALERTS.COEFFICIENT_WARNING.title}</AlertTitle>
        {EXAM_ALERTS.COEFFICIENT_WARNING.message}
      </Alert>
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.50",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
          {EXAM_FORM_LABELS.COEFFICIENT_FRACTION}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <NumberInput
            source="coefficient.numerator"
            label={EXAM_FORM_LABELS.NUMERATOR}
            validate={[required(), validateCoefficientNumerator]}
            data-testid="coefficient-numerator-input"
            sx={{
              "flex": 1,
              "minWidth": 120,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
              },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              color: PALETTE_COLORS.primary,
              fontWeight: "bold",
              mx: 1,
            }}
          >
            /
          </Typography>
          <NumberInput
            source="coefficient.denominator"
            label={EXAM_FORM_LABELS.DENOMINATOR}
            validate={[required(), validateCoefficientDenominator]}
            data-testid="coefficient-denominator-input"
            sx={{
              "flex": 1,
              "minWidth": 120,
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
              },
            }}
          />
        </Box>
        {exam?.coefficient && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: PALETTE_COLORS.yellow,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" fontWeight="bold" color="white">
              Coefficient actuel: {exam.coefficient.numerator}/
              {exam.coefficient.denominator}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
