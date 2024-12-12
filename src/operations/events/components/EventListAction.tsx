import {
  FilterForm,
  SelectInputFilter,
  DateTimeFilter,
  TextFilter,
  ButtonBase,
} from "@/ui/haToolbar";
import {Box, Typography} from "@mui/material";
import {mapToChoices} from "@/utils";
import {EVENT_TYPE_VALUE} from "../utils";
import {useRole} from "@/security/hooks";
import {Add} from "@mui/icons-material";
import {useRedirect} from "react-admin";

export function EventListAction({withDate = true}: {withDate?: boolean}) {
  const {isManager, isAdmin} = useRole();
  const redirect = useRedirect();
  return (
    <Box>
      {(isManager() || isAdmin()) && (
        <ButtonBase
          label="Créer"
          icon={<Add />}
          data-testid="add-filter"
          closeAction={false}
          onClick={() => redirect("/events/new")}
          children={<></>}
        />
      )}
      <FilterForm>
        <TextFilter label="Titre" source="title" />
        <SelectInputFilter
          choices={mapToChoices(EVENT_TYPE_VALUE, "id", "name")}
          label="Types"
          source="event_type"
        />
        {withDate && (
          <>
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
          </>
        )}
      </FilterForm>
    </Box>
  );
}
