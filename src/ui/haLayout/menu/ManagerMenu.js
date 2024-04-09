import {Box} from "@mui/material";
import {
  Work,
  School,
  People,
  AttachMoney,
  Inventory,
  Home,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem, SingleMenu} from "./utils";

function ManagerMenu() {
  return (
    <Box>
      <SingleMenu to="/teachers" label="Enseignants" icon={<Work />} />
      <ListMenu label="Étudiants" icon={<School />} data-testid="students-menu">
        <ListMenuItem
          label="Liste des étudiants"
          icon={<People />}
          to="/students"
        />
        <ListMenuItem
          label="Frais en retard"
          icon={<AttachMoney />}
          to="/fees"
        />
      </ListMenu>
      <ListMenu data-testid="docs" label="Documents" icon={<Inventory />}>
        <ListMenuItem
          to="/docs/school"
          data-testid="hei-docs"
          label="HEI"
          icon={<Home />}
        />
      </ListMenu>
    </Box>
  );
}

export default ManagerMenu;
