import {DateTimeFilter, FilterForm} from "@/ui/haToolbar";
import {Box} from "@mui/material";

export const EventMissingFilter = () => {
  return (
    <Box>
      <FilterForm>
        <DateTimeFilter label="Depuis" source="from" />
        <DateTimeFilter label="Jusqu'à" source="to" />
      </FilterForm>
    </Box>
  );
};
