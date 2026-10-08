import {HourglassEmpty} from "@mui/icons-material";
import {Box, CircularProgress, Typography} from "@mui/material";

type TableMessageRowProps = {
  message: string;
  type?: "loading" | "empty";
};

export const TableMessageRow = ({
  message,
  type = "empty",
}: Readonly<TableMessageRowProps>) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={100}
      width="100%"
      borderRadius={2}
      bgcolor="#f9f9f9"
      border="1px dashed #ddd"
    >
      {type === "loading" ? (
        <CircularProgress sx={{mb: 2}} />
      ) : (
        <HourglassEmpty sx={{fontSize: 40, color: "text.secondary", mb: 1}} />
      )}
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};
