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
      <FilterForm>
        <TextFilter data-testid="filter-group-name" source="name" label="Nom" />
        <TextFilter
          data-testid="filter-group-ref"
          source="ref"
          label="Référence"
        />
        <TextFilter
          data-testid="filter-group-create_datetime"
          source="creation_datetime"
          label="Date ou année de création"
        />
      </FilterForm>
    </Box>
  );
}
