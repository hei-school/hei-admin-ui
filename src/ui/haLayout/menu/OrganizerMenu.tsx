
import {CalendarMonth as EventIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {SingleMenu} from "./utils";
import { useFeesOnly } from "@/security/hooks/useFeesOnly";

export const OrganizerMenu = () => {
  const isFeesOnly = useFeesOnly();
  return (
    <Box>
      {!isFeesOnly && (
        <SingleMenu
          data-testid="event-menu"
          to="/events"
          label="Présences"
          icon={<EventIcon />}
          menu={undefined}
          target={undefined}
        />
      )}
    </Box>
  );
};