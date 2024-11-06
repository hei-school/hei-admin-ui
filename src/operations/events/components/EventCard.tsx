import {Event, EventType} from "@haapi/typescript-client";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  SxProps,
} from "@mui/material";
import {EVENT_TYPE_VALUE} from "../utils";
import {formatDate} from "@/utils/date";
import defaultPicture from "@/assets/blank-profile-photo.png";
import {EventEditDialog} from "../EventEditDialog";
import {useRole} from "@/security/hooks";
import {useToggle} from "@/hooks";

export type EventCardPropsType = {
  event: Required<Event> & {
    title?: string;
    planner: Pick<Event, "planner"> & {pic?: string};
  };
};

const EVENT_TYPE_SX: SxProps = {
  color: "white",
  px: 1.2,
  py: 0.4,
  borderRadius: "8px 0px 0px 8px",
};

const CARD_HEADER_SX: SxProps = {
  display: "flex",
  gap: 2,
  px: 1,
  width: "95%",
  mx: "auto",
  borderRadius: "5px",
  py: 1,
};

const CARD_SX: SxProps = {
  maxWidth: "350px",
  py: 2,
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
  const {isManager} = useRole();
  const [editShow, _, toggleEdit] = useToggle();

  return (
    <Card sx={CARD_SX} className="event-card">
      <Box sx={{width: "100%"}}>
        <CardContent sx={{px: 0}}>
          <Typography sx={{fontSize: 35, px: 1, fontWeight: "bold"}}>
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
            <Box sx={{"pl": 2, "& *": {fontSize: "12px !important"}}}>
              <Stack gap={1} direction="row">
                <Typography fontWeight="bold">Début: </Typography>
                <Typography>
                  {formatDate(event.begin_datetime, true)}
                </Typography>
              </Stack>
              <Stack gap={1} direction="row">
                <Typography fontWeight="bold">Fin: </Typography>
                <Typography>{formatDate(event.end_datetime, true)}</Typography>
              </Stack>
              <Stack gap={1} direction="row">
                <Typography fontWeight="bold">Type: </Typography>
                <Typography>{EVENT_TYPE_VALUE[event.type]}</Typography>
              </Stack>
              <Stack gap={1} direction="row">
                <Typography fontWeight="bold">Groupes: </Typography>
                <Typography>
                  {event.groups?.map((group) => group.ref).join(", ")}
                </Typography>
              </Stack>
              {event.type === EventType.COURSE && (
                <Stack gap={1} sx={{color: "red"}} direction="row">
                  <Typography fontWeight="bold">Cours: </Typography>
                  <Typography sx={{color: "red"}}>{course?.code}</Typography>
                </Stack>
              )}
            </Box>
            <Typography sx={EVENT_TYPE_SX}>
              {EVENT_TYPE_VALUE[event.type]}
            </Typography>
          </Box>
          <Typography
            noWrap
            textOverflow="ellipsis"
            sx={{
              fontSize: "14px",
              minHeight: "45px",
              px: 2,
              my: 1,
              opacity: 0.9,
            }}
          >
            {event.description ?? "Pas de description"}
          </Typography>
        </CardContent>
      </Box>
      <Box
        sx={{
          px: 2,
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
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
          href={`#/events/${event.id}/participants`}
          sx={{textTransform: "revert"}}
        >
          Présence
        </Button>
      </Box>
      <EventEditDialog
        eventId={event.id}
        editShow={editShow}
        toggleEdit={toggleEdit}
      />
    </Card>
  );
}
