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
  Home as HeiDocsIcon,
  MenuBook as PromotionIcon,
  Newspaper as AnnouncementIcon,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {useToggle} from "@/hooks";
import {DocShow} from "@/operations/docs/hei/DocShow";

function ManagerMenu() {
  const [isOpen, _set, toggle] = useToggle();
  return (
    <Box>
      <SingleMenu to="/teachers" label="Enseignants" icon={<TeachersIcon />} />
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
          label="Liste des transactions"
          icon={<TransactionsIcon />}
          to="/transactions"
        />
        <ListMenuItem label="Frais en retard" icon={<FeesIcon />} to="/fees" />
      </ListMenu>
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <ListMenuItem
          to="#"
          data-testid="hei-docs"
          label="HEI"
          icon={<HeiDocsIcon />}
          onClick={toggle}
        />
        <DocShow open={isOpen} onClose={toggle} />
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
    </Box>
  );
}

export default ManagerMenu;
