import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {AttachMoney, Receipt, Inventory, Work} from "@mui/icons-material";
import authProvider from "../../../providers/authProvider";

function StudentMenu() {
  const whoamiId = authProvider.getCachedWhoami().id;

  return (
    <>
      <SingleMenu
        to={
          whoamiId ? `/students/${authProvider.getCachedWhoami().id}/fees` : "/"
        }
        label="Frais"
        icon={<AttachMoney />}
      />
      <SingleMenu label="Notes" icon={<Receipt />} />
      <ListMenu
        data-testid="student-docs"
        label="Documents"
        icon={<Inventory />}
      >
        <ListMenuItem
          to="/hei-docs"
          data-testid="hei-docs"
          label="HEI"
          icon={<Work />}
        />
      </ListMenu>
    </>
  );
}

export default StudentMenu;
