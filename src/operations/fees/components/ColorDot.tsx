import {Box} from "@mui/material";

const DOT_SIZE = 8;

export const ColorDot = ({color}: {color: string}) => (
  <Box
    sx={{
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: "50%",
      bgcolor: color,
      flexShrink: 0,
    }}
  />
);
