import {Box} from "@mui/material";
import {
  AttachMoney as FeesIcon,
  Home as SchoolDocsIcon,
  CollectionsBookmark as TranscriptIcon,
  Inventory as DocsIcon,
  LibraryAddCheck as WorkStudyDocsIcon,
  Work as OtherDocsIcon,
  Newspaper as AnnouncementIcon,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {DocShow} from "@/operations/docs/hei/DocShow";
import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";

function StudentMenu() {
  const whoamiId = authProvider.getCachedWhoami().id;
  const [isOpen, _set, toggle] = useToggle();

  return (
    <Box>
      <SingleMenu
        to={
          whoamiId ? `/students/${authProvider.getCachedWhoami().id}/fees` : "/"
        }
        label="Frais"
        icon={<FeesIcon />}
      />
      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <ListMenuItem
          to="#"
          data-testid="hei-docs"
          label="HEI"
          icon={<SchoolDocsIcon />}
          onClick={toggle}
        />
        <DocShow open={isOpen} onClose={toggle} />
        <ListMenuItem
          to="/docs/students/TRANSCRIPT"
          data-testid="transcript-docs"
          label="Bulletins"
          icon={<TranscriptIcon />}
        />
        <ListMenuItem
          to="/docs/students/WORK_DOCUMENT"
          label="Validations d'expériences professionnelles"
          icon={<WorkStudyDocsIcon />}
        />
        <ListMenuItem
          to="/docs/students/OTHER"
          data-testid="other-docs"
          label="Autres"
          icon={<OtherDocsIcon />}
        />
      </ListMenu>
      <SingleMenu
        to="/announcements"
        label="Annonces"
        icon={<AnnouncementIcon />}
      />
    </Box>
  );
}

export default StudentMenu;
