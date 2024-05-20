import {Button, List, useListContext} from "react-admin";
import {HaListTitle} from "@/ui/haList";
import {Box} from "@mui/material";
import {Event as EventIcon} from "@mui/icons-material";
import {Event} from "@haapi/typescript-client";
import {CreateButton} from "@/ui/haToolbar";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {EventCard} from "./components";

export function EventList() {
  return (
    <List
      title="List event"
      resource="events"
      empty={false}
      exporter={false}
      pagination={<PrevNextPagination />}
      sx={{
        "& *": {
          bgcolor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Box sx={{bgcolor: "transparent", m: 0}}>
        <EventListContent />
      </Box>
    </List>
  );
}

function EventListContent() {
  const {data: events = [], isLoading} = useListContext<Required<Event>>();
  return (
    <Box sx={{px: 1, pb: 2, width: "100%"}}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Box>
  );
}
