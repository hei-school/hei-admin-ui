import {CalendarMonth as EventIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {SingleMenu} from "./utils";

export const OrganizerMenu = () => {
  return (
    <Box>
      <SingleMenu
        data-testid="event-menu"
        to="/events"
        label="Présences"
        icon={<EventIcon />}
        menu={undefined}
        target={undefined}
      />
    </Box>
  );
};
