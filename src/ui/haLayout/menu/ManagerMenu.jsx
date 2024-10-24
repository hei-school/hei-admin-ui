import {Box} from "@mui/material";
import {
  Work as TeachersIcon,
  School as StudentIcon,
  People as StudentListIcon,
  AttachMoney as FeesIcon,
  CurrencyExchange as TransactionsIcon,
  Book as CourseIcon,
  Inventory as DocsIcon,
  Group as GroupIcon,
  MenuBook as PromotionIcon,
  Newspaper as AnnouncementIcon,
  CalendarMonth as EventIcon,
  SupervisedUserCircle as MonitorIcon,
} from "@mui/icons-material";
import {HeiListMenuItem} from "@/ui/haLayout/menu/common";
import {ListMenu, ListMenuItem, SingleMenu} from "@/ui/haLayout/menu/utils";

function ManagerMenu() {
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
        <ListMenuItem label="Frais en retard" icon={<FeesIcon />} to="/fees" />
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
      <SingleMenu to="/groups" label="Groupes" icon={<GroupIcon />} />
      <SingleMenu
        data-testid="course-menu"
        to="/course"
        label="Cours"
        icon={<CourseIcon />}
      />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
      />
      <SingleMenu
        data-testid="event-menu"
        to="/events"
        label="Événements"
        icon={<EventIcon />}
      />
    </Box>
  );
}

export default ManagerMenu;
