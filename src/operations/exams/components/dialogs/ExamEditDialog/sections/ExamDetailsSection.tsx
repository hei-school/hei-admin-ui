import {PALETTE_COLORS} from "@/haTheme";
import {DateTimeField} from "@/operations/common/components/fields";
import {Box, Typography} from "@mui/material";
import {FC} from "react";
import {required, TextInput} from "react-admin";
import {EXAM_FORM_LABELS} from "../../../../utils/constants";
import {
  validateExaminationDate,
  validateExamTitle,
} from "../../../../utils/validation";

export const ExamDetailsSection: FC = () => {
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
        {EXAM_FORM_LABELS.EXAM_DETAILS_SECTION}
      </Typography>
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.50",
          borderRadius: 1,
        }}
      >
        <TextInput
          source="title"
          label={EXAM_FORM_LABELS.TITLE}
          fullWidth
          validate={[required(), validateExamTitle]}
          data-testid="title-input"
          sx={{
            "mb": 2,
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
            },
          }}
        />
        <DateTimeField
          source="examination_date"
          label={EXAM_FORM_LABELS.EXAMINATION_DATE}
          validate={[required(), validateExaminationDate]}
        />
      </Box>
    </Box>
  );
};
