import {useFeesOnly} from "@/security/hooks/useFeesOnly";
import {Inventory as OtherDocsIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {SingleMenu} from "./utils";

const StaffMenu = () => {
  const isFeesOnly = useFeesOnly();

  return (
    <Box>
      {!isFeesOnly && (
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