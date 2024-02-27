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
    <div>
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
          data-testid="transcript"
          label="Bulletins"
          icon={<CollectionsBookmark />}
        />
        <ListMenuItem
          to="/docs/students/OTHER"
          data-testid="other"
          label="Autres"
          icon={<Work />}
        />
      </ListMenu>
    </div>
  );
}

export default StudentMenu;
