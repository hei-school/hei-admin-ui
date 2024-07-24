import {List, useListContext} from "react-admin";
import {Event as EventIcon} from "@mui/icons-material";
import {Box, CircularProgress} from "@mui/material";
import {Event} from "@haapi/typescript-client";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {EventCard} from "./components";
import {EventListAction} from "./components/EventListAction";
import {HaListTitle} from "@/ui/haList";

export function EventList() {
  return (
    <List
      title="Événements"
      resource="events"
      empty={false}
      actions={false}
      pagination={<PrevNextPagination />}
      sx={{mt: 1}}
    >
      <HaListTitle
        title="Liste des événements"
        icon={<EventIcon />}
        filterIndicator
        actions={<EventListAction />}
        mainSearch={{label: "Titre", source: "title"}}
      />
      <EventListContent />
    </List>
  );
}

function EventListContent() {
  const {data: events = [], isLoading} = useListContext<Required<Event>>();
  return isLoading ? (
    <CircularProgress size={30} sx={{m: 5}} />
  ) : (
    <Box
      sx={{
        px: 1,
        pb: 2,
        display: "flex",
        alignItems: "stretch",
        flexWrap: "wrap",
        width: "100%",
        gap: 2,
      }}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Box>
  );
}
