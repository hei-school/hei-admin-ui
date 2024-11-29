import {Event} from "@haapi/typescript-client";
import {CalendarMonthOutlined, MenuBook} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  SxProps,
  Chip,
} from "@mui/material";
import {EVENT_TYPE_VALUE} from "../utils";
import {formatDate, getTime, isSameDay} from "@/utils/date";
import defaultPicture from "@/assets/blank-profile-photo.png";
import {EventEditDialog} from "../EventEditDialog";
import {useRole} from "@/security/hooks";
import {useToggle} from "@/hooks";
import {StatCard} from "./Stats";

export type EventCardPropsType = {
  event: Required<Event> & {
    title?: string;
    planner: Pick<Event, "planner"> & {pic?: string};
  };
};

const CARD_HEADER_SX: SxProps = {
  display: "flex",
  mx: "auto",
  borderRadius: "5px",
};

const CARD_SX: SxProps = {
  maxWidth: "350px",
  borderRadius: "8px",
  width: "100%",
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  flexDirection: "column",
};

export function EventCard({event}: EventCardPropsType) {
  const {planner, course} = event;
  const PLANNER_PICTURE = planner.pic || defaultPicture;
  const {isManager, isAdmin} = useRole();
  const [editShow, _, toggleEdit] = useToggle();

  return (
    <Card sx={CARD_SX} className="event-card">
      <Box sx={{width: "100%"}}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Chip
              label={EVENT_TYPE_VALUE[event.type]}
              size="small"
              color={event.type == "COURSE" ? "primary" : "default"}
            />
            {event.type == "COURSE" && (
              <Chip avatar={<MenuBook />} label={course?.code} size="small" />
            )}
          </Stack>
          <Typography sx={{fontSize: 30, fontWeight: "bold"}}>
            {event.title || ""}
          </Typography>
          <Box sx={CARD_HEADER_SX}>
            <img
              src={PLANNER_PICTURE}
              style={{borderRadius: "50%", width: "20px", display: "block"}}
            />
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              {planner.first_name + " " + planner.last_name || ""}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{"& *": {fontSize: "14px !important"}}}>
              {isSameDay(event.begin_datetime, event.end_datetime) ? (
                <Stack gap={1} direction="row" alignItems="center">
                  <CalendarMonthOutlined />
                  <Typography>{`${formatDate(event.begin_datetime, false)} de ${getTime(event.begin_datetime)} à ${getTime(event.end_datetime)}`}</Typography>
                </Stack>
              ) : (
                <>
                  <Stack gap={1} direction="row">
                    <Typography fontWeight="bold">Début: </Typography>
                    <Typography>
                      {formatDate(event.begin_datetime, true)}
                    </Typography>
                  </Stack>
                  <Stack gap={1} direction="row">
                    <Typography fontWeight="bold">Fin: </Typography>
                    <Typography>
                      {formatDate(event.end_datetime, true)}
                    </Typography>
                  </Stack>
                </>
              )}
              <Stack gap={1} direction="row">
                <Typography fontWeight="bold">Groupes: </Typography>
                <Typography>
                  {event.groups?.map((group) => group.ref).join(", ")}
                </Typography>
              </Stack>
            </Box>
          </Box>
          <Typography
            noWrap
            textOverflow="ellipsis"
            sx={{
              fontSize: "14px",
              minHeight: "45px",
              opacity: 0.9,
            }}
          >
            {event.description ?? "Pas de description"}
          </Typography>
        </CardContent>
      </Box>
      <Stack width="100%" p={1} gap={1}>
        <StatCard stats={event.count || {}} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {(isManager() || isAdmin()) && (
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
            href={`#/events/${event.id}/participants`}
            sx={{textTransform: "revert"}}
          >
            Présence
          </Button>
        </Box>
      </Stack>
      <EventEditDialog
        eventId={event.id}
        editShow={editShow}
        toggleEdit={toggleEdit}
      />
    </Card>
  );
}
