import {ListMenu, ListMenuItem, SingleMenu} from "./utils";
import {
  WorkOutlined,
  Work,
  SchoolOutlined,
  Inventory,
  PeopleOutlined,
  AttachMoney,
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
          label="Liste de tous les frais"
          icon={<AttachMoney />}
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
