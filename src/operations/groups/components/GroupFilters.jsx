import {Box} from "@mui/material";
import {
  CreateButton,
  ExportButton,
  FilterForm,
  TextFilter,
} from "../../../ui/haToolbar";
import {useRole} from "../../../security/hooks";

export function GroupFilters() {
  const {isManager} = useRole();

  return (
    <Box>
      {isManager() && <CreateButton />}
      <ExportButton />
    </Box>
  );
}
