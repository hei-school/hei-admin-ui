import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {
  WorkOutlined,
  Work,
  SchoolOutlined,
  Inventory,
  PeopleOutlined,
  WarningOutlined,
  Groups,
} from "@mui/icons-material";

function ManagerMenu() {
  return (
    <>
      <SingleMenu to="/teachers" label="Enseignants" icon={<WorkOutlined />} />
      <ListMenu
        label="Étudiants"
        icon={<SchoolOutlined />}
        data-testid="students-menu"
      >
        <ListMenuItem
          label="Liste des étudiants"
          icon={<PeopleOutlined />}
          to="/students"
        />
        <ListMenuItem
          label="Frais en retards"
          icon={<WarningOutlined />}
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
