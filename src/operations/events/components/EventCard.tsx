import {Event} from "@haapi/typescript-client";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  SxProps,
} from "@mui/material";
import {HEI_PALETTE_COLORS} from "@/ui/constants";
import defaultPicture from "@/assets/blank-profile-photo.png";
import {EVENT_TYPE_VALUE} from "../utils/eventChoices";
import {formatDate} from "@/utils/date";

export type EventCardPropsType = {
  event: Required<Event> & {
    title?: string;
    planner: Pick<Event, "planner"> & {pic?: string};
  };
};

const EDIT_BUTTON_SX: SxProps = {
  fontWeight: "bold",
  opacity: .95,
  "&:hover":{
    opacity: 1,
    bgcolor: HEI_PALETTE_COLORS.yellow["2"],
  },
  color: HEI_PALETTE_COLORS.blue["1"],
  bgcolor: HEI_PALETTE_COLORS.yellow["2"],
  pt: 0.7,
  px: 2,
};

const PARTICIPANT_BUTTON_SX: SxProps = {
  ...EDIT_BUTTON_SX,
  bgcolor: HEI_PALETTE_COLORS.blue["2"],
  color: "white",
  "&:hover":{
    opacity: 1,
    bgcolor: HEI_PALETTE_COLORS.blue["2"],
  },
}

const EVENT_TYPE_SX: SxProps = {
  bgcolor: HEI_PALETTE_COLORS.blue["3"],
  color: "white",
  px: 1.2,
  py: 0.4,
  borderRadius: "8px 0px 0px 8px",
  transform: "translateX(25px)",
};

const CARD_HEADER_SX: SxProps = {
  display: "flex",
  gap: 2,
  bgcolor: HEI_PALETTE_COLORS.yellow["2"],
  borderRadius: "5px",
  px: 2,
  py: 1,
};

const EVENT_TITLE_SX: SxProps = {
  fontWeight: "bold",
  fontSize: "16px",
  color: HEI_PALETTE_COLORS.blue["2"],
  mb: 0.5,
};

export function EventCard({event}: EventCardPropsType) {
  const {planner, course} = event;

  const PLANNER_PICTURE = planner.pic || defaultPicture;
  return (
    <Card
      sx={{maxWidth: "350px", px: 1, py: 2, borderRadius: "8px", width: "100%"}}
    >
      <Box sx={CARD_HEADER_SX}>
        <img
          src={PLANNER_PICTURE}
          style={{borderRadius: "50%", width: "40px", display: "block"}}
        />
        <Box>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "15px",
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
      <CardContent sx={{px: 2}}>
        <Typography sx={EVENT_TITLE_SX}>Event title</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={{fontSize: "12px"}}>
              Début: {formatDate(event.begin_datetime, true)}
            </Typography>
            <Typography
              sx={{fontSize: "12px", color: HEI_PALETTE_COLORS.yellow["1"]}}
            >
              Fin: {formatDate(event.end_datetime, true)}
            </Typography>
          </Box>
          <Typography sx={EVENT_TYPE_SX}>
            {EVENT_TYPE_VALUE[event.type]}
          </Typography>
        </Box>
        {event.description && (
          <Typography sx={{fontSize: "14px", my: 1, opacity: 0.9}}>
            {event.description}
          </Typography>
        )}
      </CardContent>
      <Box sx={{px: 2, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Button size="small" variant="contained" sx={EDIT_BUTTON_SX} href={`/events/${event.id}/edit`}>
          Editer
        </Button>
        <Button size="small" sx={PARTICIPANT_BUTTON_SX}>
          Présence
        </Button>
      </Box>
    </Card>
  );
}
