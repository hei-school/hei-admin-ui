import {
  dateFormats,
  dayPropGetter,
  eventStyleGetter,
  frenchMessages,
  transformApiDataToCalendarEvents,
} from "@/operations/public/utils";
import {toISO} from "@/utils/date";
import {Event} from "@haapi-3d601c85/typescript-client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Popover,
  Typography,
} from "@mui/material";
import axios from "axios";
import {Filter} from "lucide-react";
import moment from "moment";
import {useEffect, useMemo, useState} from "react";
import {
  Calendar,
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

const LoadingOverlay = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 10,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}
  >
    <CircularProgress sx={{color: "white"}} />
    <Typography color="white">Chargement…</Typography>
  </Box>
);

type SelectedGroupRefsProps = {
  refs: string[];
  onRemove: (ref: string) => void;
};

const SelectedGroupRefs = ({refs, onRemove}: SelectedGroupRefsProps) => {
  if (refs.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        maxWidth: 420,
        overflowX: "auto",
      }}
    >
      {refs.map((ref) => (
        <Box
          key={ref}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: "999px",
            backgroundColor: "rgba(246, 243, 59, 0.87)",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
          }}
        >
          {ref}
          <Box
            onClick={() => onRemove(ref)}
            sx={{
              "cursor": "pointer",
              "fontWeight": 700,
              "px": 0.5,
              "borderRadius": "50%",
              "&:hover": {
                backgroundColor: "rgba(239,68,68,0.2)",
                color: "#ef4444",
              },
            }}
          >
            ×
          </Box>
        </Box>
      ))}
    </Box>
  );
};

type FilterButtonProps = {
  active: boolean;
  count: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const FilterButton = ({active, count, onClick}: FilterButtonProps) => (
  <Button
    onClick={onClick}
    sx={{
      minWidth: 150,
      height: 36,
      borderRadius: "55px",
      backgroundColor: active ? "rgba(34,197,94,0.9)" : "rgba(59,130,246,0.9)",
      color: "white",
      textTransform: "none",
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Filter size={16} />
    Filtrer {active && `(${count})`}
  </Button>
);

type GroupRefListProps = {
  groupRefs: string[];
  selected: string[];
  onToggle: (ref: string) => void;
  onReset: () => void;
};

const GroupRefList = ({
  groupRefs,
  selected,
  onToggle,
  onReset,
}: GroupRefListProps) => (
  <Box sx={{p: 2, minWidth: 220}}>
    <Typography fontWeight={600} mb={1}>
      Groupes Ref
    </Typography>

    <Divider sx={{mb: 1}} />

    <Box sx={{maxHeight: 260, overflowY: "auto"}}>
      {groupRefs.map((ref) => {
        const isSelected = selected.includes(ref);
        return (
          <Box
            key={ref}
            onClick={() => onToggle(ref)}
            sx={{
              "display": "flex",
              "alignItems": "center",
              "px": 1,
              "py": 0.5,
              "borderRadius": 2,
              "cursor": "pointer",
              "backgroundColor": isSelected
                ? "rgba(59,130,246,0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(59,130,246,0.08)",
              },
            }}
          >
            <Checkbox size="small" checked={isSelected} />
            <Typography fontSize="0.85rem" noWrap>
              {ref}
            </Typography>
          </Box>
        );
      })}
    </Box>

    <Divider sx={{my: 1}} />

    <Button size="small" fullWidth onClick={onReset}>
      Réinitialiser
    </Button>
  </Box>
);

export const CalendarView = () => {
  const ITEM_PER_PAGE = 100;
  const [view, setView] = useState<View>(Views.WEEK);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGroupRefs, setSelectedGroupRefs] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const hasActiveFilters = selectedGroupRefs.length > 0;

  const formatDateForApi = (date: Date) =>
    encodeURIComponent(toISO(date).replace(".000Z", "+03:00"));

  const fetchEvents = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const {data} = await axios.get<Event[]>(
        `${API_URL}events?page=1&page_size=${ITEM_PER_PAGE}&from=${formatDateForApi(
          start
        )}&to=${formatDateForApi(end)}`
      );
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(
      moment().startOf("week").toDate(),
      moment().endOf("week").toDate()
    );
  }, []);

  const handleRangeChange = (range: Date[] | DateRange) => {
    if (Array.isArray(range)) {
      fetchEvents(range[0], range[range.length - 1]);
    } else if (range.start && range.end) {
      fetchEvents(range.start, range.end);
    }
  };

  const groupRefs = useMemo(() => {
    const refs = new Set<string>();
    events.forEach((e) => e.groups?.forEach((g) => g.ref && refs.add(g.ref)));
    return Array.from(refs);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!hasActiveFilters) return events;
    return events.filter((e) =>
      e.groups?.some((g) => selectedGroupRefs.includes(g.ref!))
    );
  }, [events, selectedGroupRefs, hasActiveFilters]);

  const toggleGroupRef = (ref: string) => {
    setSelectedGroupRefs((prev) =>
      prev.includes(ref) ? prev.filter((r) => r !== ref) : [...prev, ref]
    );
  };

  return (
    <Box position="relative">
      <Box
        sx={{
          position: "absolute",
          top: 25,
          right: 280,
          display: "flex",
          alignItems: "center",
          gap: 2,
          zIndex: 5,
        }}
      >
        <SelectedGroupRefs
          refs={selectedGroupRefs}
          onRemove={(ref) =>
            setSelectedGroupRefs((prev) => prev.filter((r) => r !== ref))
          }
        />

        <FilterButton
          active={hasActiveFilters}
          count={selectedGroupRefs.length}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        />
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
      >
        <GroupRefList
          groupRefs={groupRefs}
          selected={selectedGroupRefs}
          onToggle={toggleGroupRef}
          onReset={() => {
            setSelectedGroupRefs([]);
            setAnchorEl(null);
          }}
        />
      </Popover>

      {loading && <LoadingOverlay />}

      <Calendar
        localizer={localizer}
        events={transformApiDataToCalendarEvents(filteredEvents)}
        startAccessor="start"
        endAccessor="end"
        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        style={{height: "100vh"}}
        onView={setView}
        onRangeChange={handleRangeChange}
        min={new Date(0, 1, 0, 8)}
        max={new Date(0, 1, 0, 18)}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        messages={frenchMessages}
        formats={{...dateFormats, eventTimeRangeFormat: () => ""}}
        components={{event: CustomEvent}}
      />
    </Box>
  );
};
