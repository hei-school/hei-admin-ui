import {useToggle} from "@/hooks";
import {useRole} from "@/security/hooks";
import {HaListTitle} from "@/ui/haList";
import frLocale from "@fullcalendar/core/locales/fr";
import {EventClickArg, EventInput} from "@fullcalendar/react";
import {Event} from "@haapi/typescript-client";
import {Download} from "@mui/icons-material";
import {Box, Popover} from "@mui/material";
import {CompleteCalendar} from "@react-admin/ra-calendar";
import {Button, Link} from "react-admin";

import {ButtonBase} from "@/ui/haToolbar";
import {useRef, useState} from "react";
import {DeleteWithConfirm} from "../common/components";
import {stringifyObj} from "../common/utils/strinfigy-obj";
import {EventListAction, ExportEventFile, StatCard} from "./components";
import {EventLoaderCalendar} from "./components/EventLoaderCalendar";
import {EventCreate} from "./EventCreate";
import {EventEditDialog} from "./EventEditDialog";
import {EVENT_TYPE_VALUE} from "./utils";

export const EventCalendar = () => {
  const calendarRef = useRef(null);
  const [currentEvent, setCurrentEvent] = useState<Event>();
  const [editShow, _, toggleEdit] = useToggle();
  const {isManager, isAdmin, isOrganizer} = useRole();
  const [anchor, setAnchor] = useState<{
    top: number;
    left: number;
    open: boolean;
  }>({
    top: 0,
    left: 0,
    open: false,
  });
  const [filter, setFilter] = useState<{[key: string]: any}>();
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <div ref={calendarRef} id="calendar_content">
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
            title: "Présences",
            actions: (
              <Box bgcolor="white" width="100%" mt={2}>
                <EventLoaderCalendar />
                <HaListTitle
                  title=" "
                  icon={<></>}
                  filterIndicator
                  actions={
                    <>
                      <EventListAction
                        withDate={false}
                        onclose={() => setAnchor({top: 0, left: 0, open: true})}
                        open={anchor.open}
                      />
                      <ButtonBase
                        icon={<Download />}
                        onClick={() => setExportOpen(true)}
                        label="Export"
                        children={<></>}
                      />
                    </>
                  }
                  mainSearch={{label: "Titre", source: "title"}}
                />
              </Box>
            ),
            empty: false,
            pagination: false,
            children: <></>,
            queryOptions: {enabled: !!filter?.from},
          }}
          CreateDialogProps={{
            redirect: false,
            title: "Création d'un événement",
          }}
          CalendarProps={{
            selectable: isManager() || isAdmin() || isOrganizer(),
            editable: isManager() || isAdmin() || isOrganizer(),
            slotMinTime: "07:00:00",
            slotMaxTime: "19:00:00",
            initialView: "timeGridWeek",
            hiddenDays: [0],
            height: "auto",
            getFilterValueFromInterval: (dateInfo) => {
              setFilter((prevFilter) => {
                const newFilter = {
                  from: dateInfo?.startStr,
                  to: dateInfo?.endStr,
                };
                return stringifyObj(prevFilter) === stringifyObj(newFilter)
                  ? prevFilter
                  : newFilter;
              });
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
            convertToEvent: (event: Event & {color: string}) => ({
              id: event.id,
              title: `[${event.groups?.map((group) => group.ref).join(", ") ?? ""}] ${event.title} ${
                event.type === "OTHER"
                  ? (event.description ?? EVENT_TYPE_VALUE[event.type])
                  : (event.course?.code ?? EVENT_TYPE_VALUE[event.type!])
              }`,
              start: event.begin_datetime,
              end: event.end_datetime,
              backgroundColor: event?.color ?? "#54544f",
              borderColor: "#ffffff",
              extendedProps: event,
              className: "font-size-event",
            }),
          }}
        >
          <EventCreate />
        </CompleteCalendar>
      </div>

      <Popover
        open={anchor.open}
        anchorReference="anchorPosition"
        anchorPosition={anchor}
        onClose={() => setAnchor({top: 0, left: 0, open: false})}
        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        sx={{zIndex: 10000}}
      >
        <EventAction
          event={currentEvent!}
          handleClosePopover={() => setAnchor({top: 0, left: 0, open: false})}
          toggleEdit={toggleEdit}
        />
      </Popover>

      <ExportEventFile open={exportOpen} onclose={() => setExportOpen(false)} />

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
  handleClosePopover: () => void;
};

const EventAction = ({event, toggleEdit, handleClosePopover}: ActionProps) => {
  const {isManager, isAdmin, isOrganizer, isMonitor} = useRole();
  return (
    <Box
      sx={{
        width: "350px",
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "1px 1px 10px 0px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box fontWeight="bold">{event?.title}</Box>
      <StatCard stats={event?.count || {}} />
      {!isMonitor() && (
        <Link to={`/events/${event?.id}/participants`} width="100%">
          <Button
            size="small"
            sx={{textTransform: "revert", width: "100%"}}
            variant="outlined"
            label="Présence"
          />
        </Link>
      )}

      {(isAdmin() || isManager() || isOrganizer()) && (
        <>
          <Button
            size="small"
            variant="contained"
            onClick={toggleEdit}
            sx={{textTransform: "revert"}}
            label="Editer"
          />
          <DeleteWithConfirm
            resourceType="events"
            id={event.id}
            confirmContent="Voulez-vous vraiment supprimer la présence ?"
            confirmTitle="Confirmation de la suppression de présence"
            redirect="/events"
            buttonProps={{
              variant: "contained",
              type: "button",
              sx: {
                width: "100%",
              },
            }}
            onDelete={handleClosePopover}
          />
        </>
      )}
    </Box>
  );
};
