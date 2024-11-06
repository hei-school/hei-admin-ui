import {CompleteCalendar} from "@react-admin/ra-calendar";
import frLocale from "@fullcalendar/core/locales/fr";
import {Event} from "@haapi/typescript-client";
import {EventCreate} from "./EventCreate";
import {EventInput, EventClickArg} from "@fullcalendar/react";
import {EventEditDialog} from "./EventEditDialog";
import {useState} from "react";
import {Popover, Box, Button, PopoverPosition} from "@mui/material";
import {useToggle} from "@/hooks";
import {EventListAction} from "./components";
import {HaListTitle} from "@/ui/haList";
import {useRole} from "@/security/hooks";

export const EventCalendar = () => {
  const [currentEvent, setCurrentEvent] = useState<Event>();
  const [editShow, _, toggleEdit] = useToggle();
  const {isManager} = useRole();
  const [anchor, setAnchor] = useState<PopoverPosition & {open: boolean}>({
    top: 0,
    left: 0,
    open: false,
  });
  const [filter, setFilter] = useState<{[key: string]: any}>();

  const handleClose = () => setAnchor({top: 0, left: 0, open: false});

  return (
    <>
      <CompleteCalendar
        resource="events"
        transform={(calendarEvent: EventInput) => {
          const event = calendarEvent.extendedProps as Event;

          return {
            ...event,
            planner_id: event.planner?.id,
            event_type: event.type,
            course_id: event.course?.id,
            begin_datetime: calendarEvent.start,
            end_datetime: calendarEvent.end,
          };
        }}
        ListProps={{
          filter: filter || {},
          title: "Événements",
          actions: (
            <Box sx={{bgcolor: "white", width: "100%", mt: 2}}>
              <HaListTitle
                title=" "
                icon={<></>}
                filterIndicator
                actions={<EventListAction withDate={false} />}
                mainSearch={{label: "Titre", source: "title"}}
              />
            </Box>
          ),
          empty: false,
          pagination: false,
          children: <></>,
          queryOptions: {
            enabled: !!filter?.from,
          },
        }}
        CreateDialogProps={{
          redirect: false,
          title: "Création d'un événement",
        }}
        CalendarProps={{
          selectable: isManager(),
          editable: isManager(),
          getFilterValueFromInterval: (dateInfo) => {
            setFilter({from: dateInfo?.startStr, to: dateInfo?.endStr});
            return {};
          },
          eventClick: (clickInfo: EventClickArg) => {
            setCurrentEvent({
              ...clickInfo.event.extendedProps,
              title: clickInfo.event.title,
            });

            setAnchor({
              top: clickInfo.jsEvent.clientY,
              left: clickInfo.jsEvent.clientX,
              open: true,
            });
          },
          locale: frLocale,
          convertToEvent: (event: Event) => ({
            id: event.id,
            title: `${event.title} [${event.groups?.map((group) => group.ref).join(", ")}]`,
            start: event.begin_datetime,
            end: event.end_datetime,
            extendedProps: event,
          }),
        }}
      >
        <EventCreate />
      </CompleteCalendar>
      <Popover
        open={anchor.open}
        anchorReference="anchorPosition"
        anchorPosition={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{zIndex: 10000}}
      >
        <EventAction
          event={currentEvent!}
          toggleEdit={() => {
            toggleEdit();
            handleClose();
          }}
        />
      </Popover>
      <EventEditDialog
        eventId={currentEvent?.id || ""}
        editShow={editShow}
        toggleEdit={toggleEdit}
      />
    </>
  );
};

type ActionProps = {
  event: Event;
  toggleEdit: () => void;
};

const EventAction = ({event, toggleEdit}: ActionProps) => {
  const {isManager} = useRole();
  return (
    <Box
      sx={{
        width: "150px",
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "1px 1px 10px 0px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box fontWeight="bold">{event?.title}</Box>
      {isManager() && (
        <Button
          size="small"
          variant="contained"
          onClick={toggleEdit}
          sx={{textTransform: "revert"}}
        >
          Editer
        </Button>
      )}
      <Button
        size="small"
        href={`#/events/${event?.id}/participants`}
        sx={{textTransform: "revert"}}
        variant="outlined"
      >
        Présence
      </Button>
    </Box>
  );
};
