import {useRole} from "@/security/hooks";
import {HeiListMenuItem} from "@/ui/haLayout/menu/common";
import {ListMenu, ListMenuItem, SingleMenu} from "@/ui/haLayout/menu/utils";
import {trackNavClick} from "@/utils/gtm";
import {
  Newspaper as AnnouncementIcon,
  Inventory as DocsIcon,
  EditCalendar,
  EventBusy,
  CalendarMonth as EventIcon,
  AttachMoney as FeesIcon,
  GradeOutlined as GradeIcon,
  Group as GroupIcon,
  LibraryBooksOutlined as LibraryIcon,
  SupervisedUserCircle as MonitorIcon,
  MenuBook as PromotionIcon,
  AssignmentInd as StaffIcon,
  School as StudentIcon,
  People as StudentListIcon,
  Work as TeachersIcon,
  CurrencyExchange as TransactionsIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";

function AdminMenu() {
  const {role} = useRole();

  return (
    <Box>
      <SingleMenu
        to="/teachers"
        label="Enseignants"
        icon={<TeachersIcon />}
        onClick={() => trackNavClick("teachers", role)}
      />
      <SingleMenu
        to="/monitors"
        label="Moniteurs"
        icon={<MonitorIcon />}
        onClick={() => trackNavClick("monitors", role)}
        data-testid="monitors-menu"
      />
      <ListMenu
        label="Étudiants"
        icon={<StudentIcon />}
        data-testid="students-menu"
      >
        <ListMenuItem
          label="Liste des étudiants"
          icon={<StudentListIcon />}
          to="/students"
          onClick={() => trackNavClick("students_list", role)}
        />
        <ListMenuItem
          label="Transactions (Mobile Money)"
          icon={<TransactionsIcon />}
          to="/transactions"
          onClick={() => trackNavClick("transactions", role)}
        />
        <ListMenuItem
          label="Frais (en retard par défaut)"
          icon={<FeesIcon />}
          to="/fees"
          onClick={() => trackNavClick("fees", role)}
        />
      </ListMenu>
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <HeiListMenuItem onClick={() => trackNavClick("hei_docs", role)} />
      </ListMenu>
      <SingleMenu
        to="/promotions"
        label="Promotions"
        data-testid="promotions-menu"
        icon={<PromotionIcon />}
        onClick={() => trackNavClick("promotions", role)}
      />
      <SingleMenu
        to="/course"
        label="Cours"
        data-testid="course-menu"
        icon={<LibraryIcon />}
        onClick={() => trackNavClick("courses", role)}
      />
      <SingleMenu
        to="/exams"
        label="Examens"
        data-testid="exams-menu"
        icon={<GradeIcon />}
        onClick={() => trackNavClick("exams", role)}
      />
      <SingleMenu
        to="/groups"
        label="Groupes"
        icon={<GroupIcon />}
        onClick={() => trackNavClick("groups", role)}
      />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
        onClick={() => trackNavClick("announcements", role)}
      />
      <ListMenu
        icon={<EditCalendar />}
        label="Pointage"
        data-testid="event-point"
      >
        <ListMenuItem
          data-testid="event-menu"
          to="/events"
          label="Présences"
          icon={<EventIcon />}
          onClick={() => trackNavClick("events", role)}
        />
        <ListMenuItem
          data-testid="event-missing"
          to="/event_participants"
          label="Liste des absents"
          icon={<EventBusy />}
          onClick={() => trackNavClick("event_participants", role)}
        />
      </ListMenu>
      <SingleMenu
        to="/staffmembers"
        label="Staff"
        icon={<StaffIcon />}
        onClick={() => trackNavClick("staffmembers", role)}
      />
    </Box>
  );
}

export default AdminMenu;
