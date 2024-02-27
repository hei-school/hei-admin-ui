import {Box} from "@mui/material";
import {Work, School, People, AttachMoney} from "@mui/icons-material";
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
          label="Liste de tous les frais"
          icon={<AttachMoney />}
          to="/fees"
        />
      </ListMenu>
    </Box>
  );
}

export default ManagerMenu;
