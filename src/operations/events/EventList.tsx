import {List, useListContext} from "react-admin";
import {Box} from "@mui/material";
import {Event as EventIcon} from "@mui/icons-material";
import {HaListTitle} from "@/ui/haList";
import {Event} from "@haapi/typescript-client";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {EventCard} from "./components";
import {CreateButton} from "@/ui/haToolbar";

export function EventList() {
  return (
    <List
      title="List event"
      resource="events"
      empty={false}
      exporter={false}
      actions={false}
      pagination={<PrevNextPagination />}
      sx={{
        "pt": 2,
        "& .RaList-content": {
          boxShadow: "none",
        },
      }}
    >
      <HaListTitle
        filterIndicator
        mainSearch={{source: ""}}
        title="List of events"
        actions={<CreateButton resource="events" />}
        icon={<EventIcon />}
      />
      <EventListContent />
    </List>
  );
}

function EventListContent() {
  const {data: events = [], isLoading} = useListContext<Required<Event>>();
  return (
    <Box
      sx={{
        px: 1,
        pb: 2,
        w: "100%",
        display: "flex",
        alignItems: "start",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Box>
  );
}
