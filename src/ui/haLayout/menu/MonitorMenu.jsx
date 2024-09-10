import {Box} from "@mui/material";
import {
  AttachMoney as FeesIcon,
  CollectionsBookmark as TranscriptIcon,
  Inventory as DocsIcon,
  LibraryAddCheck as WorkStudyDocsIcon,
  Work as OtherDocsIcon,
  Newspaper as AnnouncementIcon,
  People as StudentListIcon,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import authProvider from "@/providers/authProvider";
import {useParams} from "react-router-dom";

function MonitorMenu() {
  const whoamiId = authProvider.getCachedWhoami().id;
  const {studentId} = useParams();

  return (
    <Box>
      <ListMenu
        label="Étudiants"
        icon={<StudentListIcon />}
        data-testid="students-menu"
      >
        <ListMenuItem
          label="Frais des étudiants"
          icon={<FeesIcon />}
          to={`/monitors/${whoamiId}/students/${studentId}/fees`}
        />
      </ListMenu>

      <ListMenu data-testid="docs" label="Documents" icon={<DocsIcon />}>
        <ListMenuItem
          to={`/monitors/${whoamiId}/students/${studentId}/docs/TRANSCRIPT`}
          data-testid="transcript-docs"
          label="Bulletins"
          icon={<TranscriptIcon />}
        />
        <ListMenuItem
          to={`/monitors/${whoamiId}/students/${studentId}/docs/WORK_DOCUMENT`}
          label="Validations d'expériences professionnelles"
          icon={<WorkStudyDocsIcon />}
        />
        <ListMenuItem
          to={`/monitors/${whoamiId}/students/${studentId}/docs/OTHER`}
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

export default MonitorMenu;
