import {
  CreateButton,
  FilterForm,
  SelectInputFilter,
  DateTimeFilter,
  TextFilter,
} from "@/ui/haToolbar";
import {Box, Typography} from "@mui/material";
import {mapToChoices} from "@/utils";
import {EVENT_TYPE_VALUE} from "../utils";
import { useRole } from "@/security/hooks";

export function EventListAction() {
  const {isManager} = useRole()
  return (
    <Box>
      {isManager() &&<CreateButton resource="events" />}
      <FilterForm>
        <TextFilter label="Titre" source="title" />
        <SelectInputFilter
          choices={mapToChoices(EVENT_TYPE_VALUE, "id", "name")}
          label="Types"
          source="event_type"
        />
        <Typography
          variant="body2"
          fontWeight="bold"
          color="#B4B5B7"
          sx={{mt: 2, mb: 1}}
        >
          Filtre par plage de date
        </Typography>
        <DateTimeFilter source="from" label="De" />
        <DateTimeFilter source="to" label="À" />
      </FilterForm>
    </Box>
  );
}
