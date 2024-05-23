import {Event, EventType} from "@haapi/typescript-client";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  SxProps,
} from "@mui/material";
import {HEI_PALETTE_COLORS} from "@/ui/constants";
import {EVENT_TYPE_VALUE} from "../utils/eventChoices";
import {formatDate} from "@/utils/date";
import defaultPicture from "@/assets/blank-profile-photo.png";

export type EventCardPropsType = {
  event: Required<Event> & {
    title?: string;
    planner: Pick<Event, "planner"> & {pic?: string};
  };
};

const EDIT_BUTTON_SX: SxProps = {
  "fontWeight": "bold",
  "opacity": 0.95,
  "&:hover": {
    opacity: 1,
    bgcolor: HEI_PALETTE_COLORS.yellow["2"],
  },
  "color": HEI_PALETTE_COLORS.blue["1"],
  "bgcolor": HEI_PALETTE_COLORS.yellow["2"],
  "pt": 0.7,
  "px": 2,
};

const PARTICIPANT_BUTTON_SX: SxProps = {
  ...EDIT_BUTTON_SX,
  "bgcolor": HEI_PALETTE_COLORS.blue["2"],
  "color": "white",
  "&:hover": {
    opacity: 1,
    bgcolor: HEI_PALETTE_COLORS.blue["2"],
  },
};

const EVENT_TYPE_SX: SxProps = {
  bgcolor: HEI_PALETTE_COLORS.blue["3"],
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
  bgcolor: HEI_PALETTE_COLORS.yellow["2"],
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

const EVENT_TITLE_SX: SxProps = {
  px: 2,
  fontWeight: "bold",
  fontSize: "16px",
  color: HEI_PALETTE_COLORS.blue["2"],
  mb: 0.5,
};

export function EventCard({event}: EventCardPropsType) {
  const {planner, course} = event;

  const PLANNER_PICTURE = planner.pic || defaultPicture;
  return (
    <Card sx={CARD_SX} className="event-card">
      <Box sx={{width: "100%"}}>
        <Box sx={CARD_HEADER_SX}>
          <img
            src={PLANNER_PICTURE}
            style={{borderRadius: "50%", width: "40px", display: "block"}}
          />
          <Box>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "15p  px: 2,x",
                color: HEI_PALETTE_COLORS.blue["2"],
              }}
            >
              {planner.first_name + " " + planner.last_name || ""}
            </Typography>
            <Typography
              sx={{
                lineHeight: 1.2,
                color: HEI_PALETTE_COLORS.blue["3"],
                fontSize: "13px",
              }}
            >
              {planner.email}
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{px: 0}}>
          <Typography sx={EVENT_TITLE_SX}>Event title</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{"pl": 2, "& *": {fontSize: "12px !important"}}}>
              <Typography>
                Début: {formatDate(event.begin_datetime, true)}
              </Typography>
              <Typography>
                Fin: {formatDate(event.end_datetime, true)}
              </Typography>
              {event.type === EventType.COURSE && (
                <Typography sx={{color: "red"}}>
                  Cours: {course.code}
                </Typography>
              )}
            </Box>
            <Typography sx={EVENT_TYPE_SX}>
              {EVENT_TYPE_VALUE[event.type]}
            </Typography>
          </Box>
          {event.description && (
            <Typography
              sx={{
                fontSize: "14px",
                minHeight: "45px",
                px: 2,
                my: 1,
                opacity: 0.9,
              }}
            >
              {event.description}
            </Typography>
          )}
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
        <Button
          size="small"
          variant="contained"
          sx={EDIT_BUTTON_SX}
          href={`/events/${event.id}/edit`}
        >
          Editer
        </Button>
        <Button size="small" sx={PARTICIPANT_BUTTON_SX}>
          Présence
        </Button>
      </Box>
    </Card>
  );
}
