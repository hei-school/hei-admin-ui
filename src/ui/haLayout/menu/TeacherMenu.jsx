import {Box} from "@mui/material";
import {
  School as StudentIcon,
  Inventory as DocsIcon,
  Group as GroupIcon,
  Home as HeiDocsIcon,
  Newspaper as AnnouncementIcon,
} from "@mui/icons-material";
import {useToggle} from "@/hooks";
import {DocShow} from "@/operations/docs/hei/DocShow";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function TeacherMenu() {
  const [isOpen, _set, toggle] = useToggle();
  return (
    <Box>
      <SingleMenu to="/students" label="Étudiants" icon={<StudentIcon />} />
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
