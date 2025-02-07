import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {Event} from "@haapi/typescript-client";
import {Box, CircularProgress, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import {List, useListContext} from "react-admin";
import {EventCard, EventListAction} from "./components";
import {EventCalendar} from "./EventCalendar";

export function EventList() {
  const [tabValue, setTab] = useState<string>("calendar");
  return (
    <>
      <Tabs
        value={tabValue}
        onChange={(_, value) => setTab(value)}
        sx={{bgcolor: "white"}}
      >
        <Tab value="calendar" label="Calendrier" />
        <Tab value="list" label="Listes" />
      </Tabs>
      {tabValue === "list" && (
        <List
          title="Présences"
          resource="events"
          empty={false}
          actions={false}
          pagination={<PrevNextPagination />}
          sx={{mt: 1}}
          disableSyncWithLocation
        >
          <HaListTitle
            title=" "
            icon={<></>}
            filterIndicator
            actions={<EventListAction />}
            mainSearch={{label: "Titre", source: "title"}}
          />
          <EventListContent />
        </List>
      )}
      {tabValue === "calendar" && <EventCalendar />}
    </>
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
      data-testid="event-list-content"
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Box>
  );
}
