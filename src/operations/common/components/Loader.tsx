import {Box, CircularProgress, CircularProgressProps} from "@mui/material";
import {FC} from "react";

export type LoaderProps = CircularProgressProps;

export const Loader: FC<LoaderProps> = ({sx, size, ...props}) => {
  return (
    <Box sx={{position: "relative", p: 2}}>
      <CircularProgress
        size={size || 20}
        color="info"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: "-12px",
          marginLeft: "-12px",
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
};
