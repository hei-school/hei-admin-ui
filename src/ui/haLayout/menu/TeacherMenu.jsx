import {Box} from "@mui/material";
import {
  School as StudentIcon,
  Inventory as DocsIcon,
  Group as GroupIcon,
  Home as HeiDocsIcon,
  Newspaper as AnnouncementIcon,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function TeacherMenu() {
  return (
    <Box>
      <SingleMenu to="/students" label="Étudiants" icon={<StudentIcon />} />
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

export default TeacherMenu;
