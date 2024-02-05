import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {
  Work,
  School,
  Inventory,
  People,
  Warning,
  Groups,
} from "@mui/icons-material";

function ManagerMenu() {
  return (
    <>
      <SingleMenu to="/teachers" label="Enseignants" icon={<Work />} />
      <ListMenu
        label="Étudiants"
        icon={<School />}
        data-testid="students-menu"
      >
        <ListMenuItem
          label="Liste des étudiants"
          icon={<People />}
          to="/students"
        />
        <ListMenuItem
          label="Frais en retards"
          icon={<Warning />}
          to="/fees"
        />
      </ListMenu>
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

export default ManagerMenu;
