import {Box} from "@mui/material";
import {
  Work as TeachersIcon,
  School as StudentIcon,
  People as StudentListIcon,
  AttachMoney as FeesIcon,
  Inventory as DocsIcon,
  Group as GroupIcon,
  Home as HeiDocsIcon,
  Newspaper as AnnouncementIcon,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function ManagerMenu() {
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
        <ListMenuItem label="Frais en retard" icon={<FeesIcon />} to="/fees" />
      </ListMenu>
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <ListMenuItem
          to="/docs/school"
          data-testid="hei-docs"
          label="HEI"
          icon={<HeiDocsIcon />}
        />
      </ListMenu>
      <SingleMenu to="/groups" label="Groupes" icon={<GroupIcon />} />
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
      />
    </Box>
  );
}

export default ManagerMenu;
