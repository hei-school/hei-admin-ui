import {useRole} from "@/security/hooks";
import {HeiListMenuItem} from "@/ui/haLayout/menu/common";
import {ListMenu, ListMenuItem, SingleMenu} from "@/ui/haLayout/menu/utils";
import {
  Newspaper as AnnouncementIcon,
  Inventory as DocsIcon,
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

function ManagerMenu() {
  const {isAdmin} = useRole();

  return (
    <Box>
      <SingleMenu to="/teachers" label="Enseignants" icon={<TeachersIcon />} />
      <SingleMenu
        to="/monitors"
        label="Moniteurs"
        icon={<MonitorIcon />}
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
        />
        <ListMenuItem
          label="Transactions (Mobile Money)"
          icon={<TransactionsIcon />}
          to="/transactions"
        />
        <ListMenuItem
          label="Frais (en retard par défaut)"
          icon={<FeesIcon />}
          to="/fees"
        />
      </ListMenu>
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <HeiListMenuItem />
      </ListMenu>
      <SingleMenu
        to="/promotions"
        label="Promotions"
        data-testid="promotions-menu"
        icon={<PromotionIcon />}
      />
      <SingleMenu
        to="/course"
        label="Cours"
        data-testid="course-menu"
        icon={<LibraryIcon />}
      />
      <SingleMenu
        to="/exams"
        label="Examens"
        data-testid="exams-menu"
        icon={<GradeIcon />}
      />
      <SingleMenu to="/groups" label="Groupes" icon={<GroupIcon />} />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
      />
      <SingleMenu
        data-testid="event-menu"
        to="/events"
        label="Présences"
        icon={<EventIcon />}
      />
      {isAdmin() && (
        <SingleMenu to="/staffmembers" label="Staff" icon={<StaffIcon />} />
      )}
    </Box>
  );
}

export default ManagerMenu;
