import {Chip, Tooltip} from "@mui/material";
import {ReactElement} from "react";

interface ExamDetailChipProps {
  icon: ReactElement;
  tooltip: string;
  label: string;
}

export const ExamDetailChip = ({icon, tooltip, label}: ExamDetailChipProps) => (
  <Tooltip title={tooltip} arrow>
    <Chip clickable label={label} icon={icon} sx={{fontWeight: 600}} />
  </Tooltip>
);
