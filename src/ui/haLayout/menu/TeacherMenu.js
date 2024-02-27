import {School} from "@mui/icons-material";
import {SingleMenu} from "./utils";

function TeacherMenu() {
  return (
    <div>
      <SingleMenu to="/students" label="Étudiants" icon={<School />} />
    </div>
  );
}

export default TeacherMenu;
