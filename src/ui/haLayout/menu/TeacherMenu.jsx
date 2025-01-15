import {Box} from "@mui/material";
import {
  School as StudentIcon,
  Inventory as DocsIcon,
  Group as GroupIcon,
  Newspaper as AnnouncementIcon,
  Book as CourseIcon,
  CalendarMonth as EventIcon,
  GradeOutlined as GradeIcon,
  PictureAsPdf,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {HeiListMenuItem} from "./common";

function TeacherMenu() {
  return (
    <Box>
      <SingleMenu to="/students" label="Étudiants" icon={<StudentIcon />} />
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <HeiListMenuItem />
        <ListMenuItem
          to="/docs/teachers/OTHER"
          label="Documents personnels"
          icon={<PictureAsPdf />}
        />
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
      <SingleMenu
        data-testid="exam-menu"
        to="/exams"
        label="Examens"
        icon={<GradeIcon />}
      />
      <SingleMenu
        data-testid="event-menu"
        to="/events"
        label="Présences"
        icon={<EventIcon />}
      />
    </Box>
  );
}

export default TeacherMenu;
