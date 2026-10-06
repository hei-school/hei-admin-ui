import {IconButton, Tooltip} from "@mui/material";
import {ReactNode} from "react";

export const IconButtonWithTooltip = ({
  title,
  children,
  disabled = false,
}: Readonly<{
  title: string;
  children: ReactNode;
  disabled?: boolean;
}>) => {
  return (
    <Tooltip title={title}>
      <IconButton disabled={disabled}>{children}</IconButton>
    </Tooltip>
  );
};
