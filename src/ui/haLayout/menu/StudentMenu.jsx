import authProvider from "@/providers/authProvider";
import {
  Newspaper as AnnouncementIcon,
  Inventory as DocsIcon,
  CalendarMonth as EventIcon,
  AttachMoney as FeesIcon,
  Logout as LogoutIcon,
  Work as OtherDocsIcon,
  CollectionsBookmark as TranscriptIcon,
  LibraryAddCheck as WorkStudyDocsIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";
import {HeiListMenuItem} from "./common";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function StudentMenu() {
  const whoamiId = authProvider.getCachedWhoami().id;
  const logout = async () => {
    await authProvider.logout();
    window.location.reload();
  };

  return (
    <Box sx={{position: "relative"}} height="calc(100% - 100px)">
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
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1,
        }}
      >
        <SingleMenu
          label="Se déconnecter"
          icon={<LogoutIcon />}
          onClick={() => logout()}
        />
      </Box>
    </Box>
  );
}

export default StudentMenu;
