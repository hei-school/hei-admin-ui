import {Event} from "@haapi/typescript-client";
import {Box, Typography, Card, CardContent} from "@mui/material";
import {Event as EventIcon} from "@mui/icons-material";
import {PALETTE_COLORS} from "@/ui/constants";
import {formatDate} from "@/utils/date";

export type EventCardPropsType = {
  event: Required<Event> & {
    title?: string;
    planner: Pick<Event, "planner"> & {pic?: string};
  };
};

function EventDate({date}: {date: Date}) {
  const [day, month, year] = formatDate(date).split(" ");

  return (
    <Box
      sx={{
        "bgcolor": PALETTE_COLORS.yellow,
        "p": 1,
        "width": "70px",
        "overflowY": "visible",
        "textAlign": "center",
        "& *": {
          p: 0,
          m: 0,
          lineHeight: 1,
        },
      }}
    >
      <Typography sx={{fontSize: "1.8rem", m: 0, p: 0}}>{day}</Typography>
      <Typography sx={{fontSize: "1rem", m: 0, p: 0}}>{month}</Typography>
      <Typography sx={{fontSize: "1rem", m: 0, p: 0}}>{year}</Typography>
    </Box>
  );
}

export function EventCard({event}: EventCardPropsType) {
  const {planner} = event;

  return (
    <Card
      sx={{
        "width": "30%",
        "overflow": "visible",
        "& *": {bgcolor: "white !important"},
        "bgcolor": "white !important",
        "p": 2,
        "borderRadius": "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflowY: "visible",
          alignItems: "end",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
          <EventIcon sx={{fontSize: "2rem"}} />
          <Typography
            sx={{fontWeight: "bold", color: "#454443", fontSize: "14px"}}
          >
            Presence L1
          </Typography>
        </Box>
        <EventDate date={new Date(event.begin_datetime)} />
      </Box>
      <CardContent>
        <Typography
          sx={{fontWeight: "bold", color: "#454443", fontSize: "16px"}}
        >
          Présence L1
        </Typography>
        {event.description}
      </CardContent>
    </Card>
  );
}
