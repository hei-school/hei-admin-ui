import {FilterForm, SelectInputFilter, TextFilter} from "@/ui/haToolbar";
import {Box} from "@mui/material";
import {ATTENDANCE_STATUS} from "../utils";

export const EventParticipantsFilter = () => {
  return (
    <Box>
      <FilterForm>
        <TextFilter label="Références des groupes " source="groupRef" />
        <TextFilter label="Référence étudiant" source="studentRef" />
        <TextFilter label="Nom ou prénom de l'étudiant" source="name" />
        <SelectInputFilter
          label="Status"
          source="status"
          choices={ATTENDANCE_STATUS}
        />
      </FilterForm>
    </Box>
  );
};
