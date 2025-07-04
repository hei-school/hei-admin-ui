import moment from "moment";
import {useEffect, useState} from "react";
import {
  Calendar,
  DateRange,
  momentLocalizer,
  View,
  Views,
} from "react-big-calendar";

import {
  dateFormats,
  dayPropGetter,
  eventStyleGetter,
  frenchMessages,
  transformApiDataToCalendarEvents,
} from "@/operations/public/utils";

import {toISO} from "@/utils/date";
import {Event} from "@haapi/typescript-client";
import {Box, CircularProgress, Typography} from "@mui/material";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style/calendar.css";

moment.locale("fr");
const localizer = momentLocalizer(moment);

const API_URL = process.env.REACT_APP_API_URL;

export default function CalendarView() {
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
        formats={dateFormats}
      />
    </Box>
  );
}
