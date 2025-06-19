import moment from "moment";
import {useEffect, useState} from "react";
import {Calendar, momentLocalizer, View, Views} from "react-big-calendar";

import {
  dateFormats,
  dayPropGetter,
  eventStyleGetter,
  frenchMessages,
  transformApiDataToCalendarEvents,
} from "@/operations/public/utils";

import {Box, CircularProgress, Typography} from "@mui/material";
import axios from "axios";
import {addDays, subDays} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style/calendar.css";

moment.locale("fr");
const localizer = momentLocalizer(moment);

const API_URL = process.env.REACT_APP_API_URL;

export default function CalendarView() {
  const ITEM_PER_PAGE = 100;
  const [view, setView] = useState<View>(Views.WEEK);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const startDate = subDays(currentDate, 7).toISOString();
  const endDate = addDays(currentDate, 7).toISOString();

  const fetchEvents = async () => {
    try {
      const {data} = await axios.get(
        `${API_URL}/events?page=1&page_size=${ITEM_PER_PAGE}&from=${startDate}&to=${endDate}`
      );
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
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
            Chargement des évènements
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
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 18, 0, 0)}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        messages={frenchMessages}
        formats={dateFormats}
      />
    </Box>
  );
}
