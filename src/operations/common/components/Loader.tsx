import {Box, CircularProgress, CircularProgressProps} from "@mui/material";

export type LoaderProps = CircularProgressProps;

export const Loader = ({sx, size, ...props}: Readonly<LoaderProps>) => {
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
