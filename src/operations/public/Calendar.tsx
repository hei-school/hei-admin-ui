import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import moment from "moment";
import {useEffect, useState} from "react";
import {Calendar, momentLocalizer, View, Views} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const [view, setView] = useState<View>(Views.WEEK);
  const [events, setEvents] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  console.log(events);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  useEffect(() => {
    fetch(`${API_URL}/events?page=1&page_size=${MAX_ITEM_PER_PAGE}`)
      .then((res) => res.json())
      .then((res) => {
        setEvents(res);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [API_URL]);

  const transformApiDataToCalendarEvents = (data: any) => {
    if (!Array.isArray(data)) {
      console.error("Expected an array but got:", data);
      return [];
    }

    return data
      .filter((event) => event != null)
      .map((event: any) => ({
        id: event.id,
        title: event.title || "Untitled Event",
        start: new Date(event.begin_datetime),
        end: new Date(event.end_datetime),
        description: event.description,
        color: event.color,
      }));
  };

  const calendarEvents = transformApiDataToCalendarEvents(events);

  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: event.color || "defaultColor",
      borderRadius: "10px",
      border: "2px solid white",
      fontWeight: "bold",
      color: "white",
    };

    return {
      style,
    };
  };

  const dayPropGetter = (date: Date) => {
    const isSunday = date.getDay() === 0;
    return {
      style: {
        display: isSunday ? "none" : "block",
      },
    };
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      view={view}
      views={["week"]}
      style={{height: "100vh"}}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 7, 0, 0)}
      max={new Date(2025, 1, 0, 19, 0, 0)}
      eventPropGetter={eventStyleGetter}
      dayPropGetter={dayPropGetter}
    />
  );
}
