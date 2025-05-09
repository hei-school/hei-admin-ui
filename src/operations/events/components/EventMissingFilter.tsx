import {DateTimeFilter, FilterForm, TextFilter} from "@/ui/haToolbar";
import {Box} from "@mui/material";

export const EventMissingFilter = () => {
  return (
    <Box>
      <FilterForm>
        <DateTimeFilter label="Depuis" source="from" />
        <DateTimeFilter label="Jusqu'à" source="to" />
        <TextFilter label="Nom de l'étudiant" source="studentName" />
        <TextFilter label="Référence étudiant" source="studentRef" />
        <TextFilter label="Référence groupe" source="groupRef" />
      </FilterForm>
    </Box>
  );
};
