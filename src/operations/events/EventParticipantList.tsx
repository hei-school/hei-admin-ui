import {useParams} from "react-router-dom";
import {FunctionField, SimpleShowLayout, TextField} from "react-admin";
import {Event as EventIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {EventParticipant} from "@haapi/typescript-client";
import {HaList} from "@/ui/haList";
import {FilterForm, TextFilter} from "@/ui/haToolbar";
import {Show} from "../common/components";
import {DateField} from "../common/components/fields";
import {EMPTY_TEXT} from "@/ui/constants";
import {title} from "process";

export function EventParticipantList() {
  const {eventId} = useParams();

  return (
    <Box>
      <Show title=" " id={eventId} resource="events">
        <SimpleShowLayout sx={{bgcolor: "white"}}>
          <TextField source="title" emptyText={EMPTY_TEXT} label="Titre" />
          <DateField label="De" source="begin_datetime" showTime />
          <DateField label="À" source="end_datetime" showTime />
        </SimpleShowLayout>
      </Show>
      <HaList
        resource="event-participants"
        title="Listes des participants"
        icon={<EventIcon />}
        mainSearch={{source: "group_ref", label: "Groupe"}}
        listProps={{
          title: "Présence",
          queryOptions: {
            meta: {eventId},
          },
        }}
        actions={
          <FilterForm>
            <TextFilter source="group_ref" label="Groupe" />
          </FilterForm>
        }
        datagridProps={{
          rowClick: false,
        }}
      >
        <TextField source="ref" label="Référence" />
        <TextField source="last_name" label="Nom" />
        <TextField source="first_name" label="Prénom-s" />
        <FunctionField
          label="Présent"
          render={(eventParticipant: EventParticipant) => {
            return eventParticipant.email;
          }}
        />
      </HaList>
    </Box>
  );
}
