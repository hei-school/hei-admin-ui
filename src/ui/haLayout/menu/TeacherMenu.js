import {School, Inventory, Work} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function TeacherMenu() {
  return (
    <>
      <SingleMenu to="/students" label="Étudiants" icon={<School />} />
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

export default TeacherMenu;
