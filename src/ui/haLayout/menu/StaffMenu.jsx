import {FEES_ONLY} from "@/config/featureFlag";
import {Inventory as OtherDocsIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {SingleMenu} from "./utils";

const StaffMenu = () => {
  return (
    <Box>
      {!FEES_ONLY && (
        <SingleMenu
          to="/docs/staff/OTHER"
          data-testid="other-docs"
          label="Documents"
          icon={<OtherDocsIcon />}
        />
      )}
    </Box>
  );
};

export default StaffMenu;