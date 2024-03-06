import {Box} from "@mui/material";
import {School} from "@mui/icons-material";
import {SingleMenu} from "./utils";

function TeacherMenu() {
  return (
    <Box>
      <SingleMenu to="/students" label="Étudiants" icon={<School />} />
    </Box>
  );
}

export default TeacherMenu;
