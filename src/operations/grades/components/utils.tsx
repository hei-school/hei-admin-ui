import {Typography} from "@mui/material";

export const renderWeightedAverage = (value: number | null | undefined) => {
  const numericValue = Number(value);
  if (value == null || isNaN(numericValue)) {
    return (
      <Typography color="text.secondary" fontWeight="bold" fontSize="0.875rem">
        N/A
      </Typography>
    );
  }

  const color = numericValue >= 10 ? "success.main" : "error.main";

  return (
    <Typography fontWeight="bold" color={color}>
      {numericValue.toFixed(2)}/20
    </Typography>
  );
};
