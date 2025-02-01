import {
  Newspaper as AnnouncementIcon,
  Book as CourseIcon,
  Inventory as DocsIcon,
  CalendarMonth as EventIcon,
  GradeOutlined as GradeIcon,
  Group as GroupIcon,
  HistoryEdu as HistoryEduIcon,
  Mode as ModeIcon,
  PictureAsPdf as PictureAsPdfIcon,
  School as StudentIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";
import {HeiListMenuItem} from "./common";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function TeacherMenu() {
  return (
    <Box>
      <SingleMenu to="/students" label="Étudiants" icon={<StudentIcon />} />
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <HeiListMenuItem />
        <ListMenuItem
          to="/docs/teachers/OTHER"
          label="Documents personnels"
          icon={<PictureAsPdfIcon />}
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
      <ListMenu label="Gestion académique" icon={<HistoryEduIcon />}>
        <ListMenuItem
          data-testid="exam-menu"
          to="/exams"
          label="Examens"
          icon={<ModeIcon />}
        />
        <ListMenuItem to="/grades" label="Notes" icon={<GradeIcon />} />
      </ListMenu>
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
