import {
  ReportProblem as ComplaintIcon,
  Inventory as OtherDocsIcon,
} from "@mui/icons-material";
import {Box} from "@mui/material";
import {SingleMenu} from "./utils";

const StaffMenu = () => {
  return (
    <Box>
      <SingleMenu
        to="/docs/staff/OTHER"
        data-testid="other-docs"
        label="Documents"
        icon={<OtherDocsIcon />}
      />
      <SingleMenu
        to="/complaints"
        label="Réclamations"
        icon={<ComplaintIcon />}
      />
    </Box>
  );
};

export default StaffMenu;
