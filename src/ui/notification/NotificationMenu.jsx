import {PALETTE_COLORS} from "@/haTheme";
import {Notifications} from "@mui/icons-material";
import {Badge, IconButton, Popover, Tooltip} from "@mui/material";
import {useState} from "react";
import NotificationContent from "./NotificationContent";

function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <Tooltip
        title="Notification"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <IconButton>
          <Badge badgeContent={0} sx={{color: PALETTE_COLORS.yellow}}>
            <Notifications sx={{color: PALETTE_COLORS.black}} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <NotificationContent />
      </Popover>
    </>
  );
}

export default NotificationMenu;
