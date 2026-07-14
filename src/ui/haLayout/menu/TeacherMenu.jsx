import {FEES_ONLY} from "@/config/featureFlag";
import {
  Newspaper as AnnouncementIcon,
  Book as CourseIcon,
  Inventory as DocsIcon,
  CalendarMonth as EventIcon,
  GradeOutlined as GradeIcon,
  Group as GroupIcon,
  PictureAsPdf,
  School as StudentIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";
import {HeiListMenuItem} from "./common";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function TeacherMenu() {
  return (
    <Box>
      {!FEES_ONLY && (
        <SingleMenu to="/students" label="Étudiants" icon={<StudentIcon />} />
      )}
      {!FEES_ONLY && (
        <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
          <HeiListMenuItem />
          <ListMenuItem
            to="/docs/teachers/OTHER"
            label="Documents personnels"
            icon={<PictureAsPdf />}
          />
        </ListMenu>
      )}
      {!FEES_ONLY && (
        <SingleMenu to="/groups" label="Groupes" icon={<GroupIcon />} />
      )}
      {!FEES_ONLY && (
        <SingleMenu
          to="/announcements"
          label="Annonces"
          icon={<AnnouncementIcon />}
        />
      )}
      {!FEES_ONLY && (
        <SingleMenu
          data-testid="course-menu"
          to="/course"
          label="Cours"
          icon={<CourseIcon />}
        />
      )}
      {!FEES_ONLY && (
        <SingleMenu
          data-testid="exam-menu"
          to="/exams"
          label="Examens"
          icon={<GradeIcon />}
        />
      )}
      {!FEES_ONLY && (
        <SingleMenu
          data-testid="event-menu"
          to="/events"
          label="Présences"
          icon={<EventIcon />}
        />
      )}
    </Box>
  );
}

export default TeacherMenu;