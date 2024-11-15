import {FC, ReactNode} from "react";
import {IconButton, Tooltip} from "@mui/material";

export const IconButtonWithTooltip: FC<{
  title: string;
  children: ReactNode;
  disabled?: boolean;
}> = ({title, children, disabled = false}) => {
  return (
    <Tooltip title={title}>
      <IconButton disabled={disabled}>{children}</IconButton>
    </Tooltip>
  );
};
