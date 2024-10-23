import {Box} from "@mui/material";
import {
  School as StudentIcon,
  Inventory as DocsIcon,
  Group as GroupIcon,
  Newspaper as AnnouncementIcon,
  Book as CourseIcon,
  CalendarMonth as EventIcon,
} from "@mui/icons-material";
import {ListMenu, SingleMenu} from "./utils";
import {HeiListMenuItem} from "./common";

function TeacherMenu() {
  return (
    <Box>
      <SingleMenu to="/students" label="Étudiants" icon={<StudentIcon />} />
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <HeiListMenuItem />
      </ListMenu>
      <SingleMenu to="/groups" label="Groupes" icon={<GroupIcon />} />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
      />
      <SingleMenu
        data-testid="course-menu"
        to="/course"
        label="Cours"
        icon={<CourseIcon />}
      />
      {/* <SingleMenu
        data-testid="event-menu"
        to="/events"
        label="Événements"
        icon={<EventIcon />}
      /> */}
    </Box>
  );
}

export default TeacherMenu;
