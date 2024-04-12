import { Box } from "@mui/material";
import { School, Home, Inventory } from "@mui/icons-material";
import { ListMenu, ListMenuItem, SingleMenu } from "./utils";

function TeacherMenu() {
  return (
    <Box>
      <SingleMenu to="/students" label="Étudiants" icon={<School />} />
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

export default TeacherMenu;
