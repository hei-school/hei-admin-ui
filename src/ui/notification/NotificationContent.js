import {Box, Typography} from "@mui/material";
import {PALETTE_COLORS} from "../constants";

//TODO: wait for backend implementation
function NotificationContent() {
  return (
    <Box sx={{p: 2, width: "250px", overflowY: "sroll", maxHeight: "300px"}}>
      <Typography sx={{fontSize: "1em", color: PALETTE_COLORS.black}}>
        Aucune notification
      </Typography>
    </Box>
  );
}

export default NotificationContent;
