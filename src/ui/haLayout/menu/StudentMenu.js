import {Box} from "@mui/material";
import {
  AttachMoney,
  Home,
  CollectionsBookmark,
  Inventory,
  Work,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import authProvider from "../../../providers/authProvider";

function StudentMenu() {
  const whoamiId = authProvider.getCachedWhoami().id;

  return (
    <Box>
      <SingleMenu
        to={
          whoamiId ? `/students/${authProvider.getCachedWhoami().id}/fees` : "/"
        }
        label="Frais"
        icon={<AttachMoney />}
      />
      <ListMenu data-testid="docs" label="Documents" icon={<Inventory />}>
        <ListMenuItem
          to="/docs/school"
          data-testid="hei-docs"
          label="HEI"
          icon={<Home />}
        />
        <ListMenuItem
          to="/docs/students/TRANSCRIPT"
          data-testid="transcript-docs"
          label="Bulletins"
          icon={<CollectionsBookmark />}
        />
        <ListMenuItem
          to="/docs/students/OTHER"
          data-testid="other-docs"
          label="Autres"
          icon={<Work />}
        />
      </ListMenu>
    </Box>
  );
}

export default StudentMenu;
