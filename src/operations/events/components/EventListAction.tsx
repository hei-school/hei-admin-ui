import {
  CreateButton,
  FilterForm,
  SelectInputFilter,
  DateTimeFilter,
} from "@/ui/haToolbar";
import {Typography} from "@mui/material";
import {mapToChoices} from "@/utils";
import {EVENT_TYPE_VALUE} from "../utils/eventChoices";

export function EventListAction() {
  return (
    <>
      <CreateButton resource="events" />
      <FilterForm>
        {/* //FIXME: Add title filter  */}
        {/* <TextFilter label="Titre" source="title" /> */}
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
    </>
  );
}