import {Box} from "@mui/material";
import {
  AttachMoney as FeesIcon,
  CollectionsBookmark as TranscriptIcon,
  Inventory as DocsIcon,
  LibraryAddCheck as WorkStudyDocsIcon,
  Work as OtherDocsIcon,
  Newspaper as AnnouncementIcon,
  CalendarMonth as EventIcon,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {HeiListMenuItem} from "./common";
import authProvider from "@/providers/authProvider";

function StudentMenu() {
  const whoamiId = authProvider.getCachedWhoami().id;

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
        <HeiListMenuItem />
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
      <SingleMenu
        data-testid="event-menu"
        to="/events"
        label="Présences"
        icon={<EventIcon />}
      />
    </Box>
  );
}

export default StudentMenu;
