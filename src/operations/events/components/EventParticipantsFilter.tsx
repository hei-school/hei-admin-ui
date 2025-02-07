import {FilterForm, SelectInputFilter, TextFilter} from "@/ui/haToolbar";
import {Box} from "@mui/material";
import {FC} from "react";
import {ATTENDANCE_STATUS} from "../utils";

export const EventParticipantsFilter: FC = () => {
  return (
    <Box>
      <FilterForm>
        <TextFilter label="Références des groupes " source="groupRef" />
        <TextFilter label="Références étudiant(e)s" source="studentRef" />
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
