import {
  dateFormats,
  dayPropGetter,
  eventStyleGetter,
  frenchMessages,
  transformApiDataToCalendarEvents,
} from "@/operations/public/utils";
import {toISO} from "@/utils/date";
import {Event} from "@haapi-b0fc7615/typescript-client";
import {Box, CircularProgress, Typography} from "@mui/material";
import axios from "axios";
import moment from "moment";
import {useEffect, useState} from "react";
import {
  Calendar,
  Components,
  DateRange,
  momentLocalizer,
  View,
  Views,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style/calendar.css";

moment.locale("fr");
const localizer = momentLocalizer(moment);
const API_URL = process.env.REACT_APP_API_URL;

const CustomEvent = ({event}: {event: any}) => {
  const timeFormat = `${moment(event.start).format("HH:mm")} - ${moment(event.end).format("HH:mm")}`;

  const onlineIcon = event.isOnline ? (
    <Box
      component="div"
      title="Événement en ligne"
      sx={{
        backgroundColor: "white",
        padding: "2px 6px",
        color: "black",
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "4px",
        fontSize: "0.75em",
        marginBottom: "4px",
        width: "fit-content",
      }}
    >
      <img
        src="/icons8-google-meet-48.png"
        alt=""
        style={{width: 16, height: 16, marginRight: 4}}
      />
      <span>Meet</span>
    </Box>
  ) : null;

  return (
    <div style={{height: "100%", overflow: "hidden", padding: "4px"}}>
      {onlineIcon}
      <div style={{fontSize: "0.9em", fontWeight: 600, marginBottom: "2px"}}>
        {timeFormat}
      </div>
      <div style={{fontWeight: 500, fontSize: "0.95em"}}>{event.title}</div>
    </div>
  );
};

export const CalendarView = () => {
  const ITEM_PER_PAGE = 100;
  const [view, setView] = useState<View>(Views.WEEK);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formatDateForApi = (date: Date) =>
    encodeURIComponent(toISO(date).replace(".000Z", "+03:00"));

  const fetchEvents = async (startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      const from = formatDateForApi(startDate);
      const to = formatDateForApi(endDate);

      const {data} = await axios.get<Event[]>(
        `${API_URL}events?page=1&page_size=${ITEM_PER_PAGE}&from=${from}&to=${to}`
      );
      setEvents(data);
    } catch (error) {
      console.error("Erreur lors du chargement des événements :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const startOfWeek = moment(today).startOf("week").toDate();
    const endOfWeek = moment(today).endOf("week").toDate();
    fetchEvents(startOfWeek, endOfWeek);
  }, []);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleRangeChange = (range: Date[] | DateRange) => {
    let start: Date;
    let end: Date;

    if (Array.isArray(range)) {
      start = range[0];
      end = range[range.length - 1];
    } else if (range.start && range.end) {
      start = range.start;
      end = range.end;
    } else {
      console.warn("Plage inattendue reçue :", range);
      return;
    }

    fetchEvents(start, end);
  };

  const calendarEvents = transformApiDataToCalendarEvents(events);

  const customFormats = {
    ...dateFormats,
    eventTimeRangeFormat: () => "",
  };

  const components: Components = {
    event: CustomEvent,
  };

  return (
    <Box>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh",
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <CircularProgress sx={{color: "white"}} />
          <Typography variant="h6" color="white">
            Chargement des événements
          </Typography>
        </Box>
      )}
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        style={{height: "100vh"}}
        onView={handleOnChangeView}
        onRangeChange={handleRangeChange}
        min={new Date(0, 1, 0, 8, 0, 0)}
        max={new Date(0, 1, 0, 18, 0, 0)}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        messages={frenchMessages}
        formats={customFormats}
        components={components}
      />
    </Box>
  );
};
