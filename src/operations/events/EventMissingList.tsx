import {HaList} from "@/ui/haList";
import {NOOP_ID} from "@/utils/constants";
import {EventAttendance} from "@haapi/typescript-client";
import {alpha, Avatar, Box, Chip, Tooltip, Typography} from "@mui/material";
import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarX,
  ClipboardList,
} from "lucide-react";
import {FC} from "react";
import {
  DateField,
  FunctionField,
  TextField,
  useGetOne,
  useRecordContext,
} from "react-admin";
import {ListHeader} from "../common/components";
import {EventMissingFilter} from "./components/EventMissingFilter";
import {EVENT_TYPE_VALUE} from "./utils";

const TOOLTIP_STYLE = {
  backgroundColor: "#f5f5f9",
  color: "rgba(0, 0, 0, 0.87)",
  maxWidth: 300,
  fontSize: "12px",
  border: "1px solid #dadde9 ",
  borderTop: "5px solid",
};

export const EventMissingList: FC = () => {
  const {
    data: stats = {
      present: "0",
      late: "0",
      total: "0",
    },
  } = useGetOne("stats", {
    id: NOOP_ID,
    meta: {resource: "events"},
  });

  const eventsHeaderContent = [
    {
      title: "Absents",
      icon: <CalendarX size="2.1rem" />,
      total: stats.missing,
    },
    {
      title: "Présents",
      icon: <CalendarCheck2 size="2.1rem" />,
      total: stats.present,
    },
    {
      title: "En retard",
      icon: <CalendarClock size="2.1rem" />,
      total: stats.late,
    },
    {
      title: "Total",
      icon: <CalendarDays size="2.1rem" />,
      total: stats.total,
    },
  ];

  return (
    <Box>
      <ListHeader
        title="Statistiques des absences"
        cardContents={eventsHeaderContent}
      />
      <HaList
        title="Listes des absences"
        actions={<EventMissingFilter />}
        resource="missing-event"
        icon={<ClipboardList />}
        mainSearch={{label: "Références", source: "studentRef"}}
        datagridProps={{
          rowClick: false,
          rowStyle: (record: any) => ({
            borderLeft: "5px solid",
            padding: "0 !important",
            borderLeftColor:
              record?.event?.groups[0]?.attributed_color ?? "#0000FF",
          }),
        }}
      >
        <FunctionField render={() => <AvatarGroup />} label="Groupe" />
        <TextField source="event_participant.ref" label="Références" />
        <TextField source="event_participant.first_name" label="Prénom" />
        <TextField source="event_participant.last_name" label="Nom" />
        <FunctionField render={() => <CourseTooltip />} label="Matière" />
        <FunctionField
          render={() => <EventTypeItem />}
          source="event.type"
          label="Type d'évènement"
        />
        <FunctionField render={() => <DateTooltip />} label="Date" />
      </HaList>
    </Box>
  );
};

const EventTypeItem: FC = () => {
  const record = useRecordContext<EventAttendance>();
  if (!record) return null;
  const typeColor =
    record.event?.type === "COURSE" ? "#0000FF" : record.event?.color;

  return (
    <Chip
      sx={{
        border: "1px solid",
        borderColor: typeColor,
        color: typeColor,
        backgroundColor: alpha(typeColor!, 0.2),
        fontSize: "0.8rem",
        fontWeight: "800",
        textTransform: "uppercase",
      }}
      label={record.event?.type ? EVENT_TYPE_VALUE[record.event.type] : ""}
    />
  );
};

const AvatarGroup: FC = () => {
  const record = useRecordContext<EventAttendance>();
  const groupe = record?.event?.groups?.[0];
  if (!record) return null;
  return (
    <Avatar
      children={groupe?.ref}
      sx={{
        backgroundColor: groupe?.attributed_color,
      }}
    />
  );
};

const CourseTooltip: FC = () => {
  const record = useRecordContext<EventAttendance>();
  if (!record) return null;

  return record.event?.type === "COURSE" ? (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {...TOOLTIP_STYLE, borderTopColor: record.event?.color},
        },
      }}
      title={
        <Box sx={{p: 1}}>
          <Typography variant="subtitle1" fontWeight="bold">
            {record.event?.course?.name}
          </Typography>
          <Typography variant="body2">
            {`${record.event?.course?.credits!} credits • ${record.event?.course?.total_hours!} au total`}
          </Typography>
        </Box>
      }
    >
      <Box>
        <Typography sx={{width: "100%"}}>
          {record.event?.course?.code}
        </Typography>
      </Box>
    </Tooltip>
  ) : (
    <Typography>
      {record.event?.type === "OTHER"
        ? record.event?.title
        : EVENT_TYPE_VALUE[record.event?.type!]}
    </Typography>
  );
};

const DateTooltip: FC = () => {
  const record = useRecordContext<EventAttendance>();
  if (!record) return null;

  const beginDate = new Date(record.event?.begin_datetime!);
  const endDate = new Date(record.event?.end_datetime!);

  const BOX_STYLE = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: "0.5rem",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  };

  const otherEventTypeLabel =
    record.event?.type === "OTHER"
      ? record.event?.title
      : EVENT_TYPE_VALUE[record.event?.type!];
  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {...TOOLTIP_STYLE, borderTopColor: record.event?.color},
        },
      }}
      placement="top"
      title={
        <Box sx={{px: 0.1, py: 0.5}}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{mb: 0.5}}>
            {record.event?.type === "COURSE"
              ? record.event?.course?.name +
                " - " +
                "Salle " +
                record.event?.title
              : otherEventTypeLabel}
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap="0.5rem">
            <Box sx={BOX_STYLE}>
              <Typography variant="subtitle2" fontWeight="bold">
                Début
              </Typography>
              <DateField
                source="event.begin_datetime"
                locales="fr-FR"
                options={{year: "numeric", month: "short", day: "numeric"}}
              />
              <FunctionField
                label="Heure"
                render={() => {
                  return beginDate.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }}
              />
            </Box>
            <Box sx={BOX_STYLE}>
              <Typography variant="subtitle2" fontWeight="bold">
                Fin
              </Typography>
              <DateField
                source="event.end_datetime"
                locales="fr-FR"
                options={{year: "numeric", month: "short", day: "numeric"}}
              />
              <FunctionField
                label="Heure"
                render={() => {
                  return endDate.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }}
              />
            </Box>
          </Box>
        </Box>
      }
    >
      <Box display="flex" alignItems="center" gap="0.5rem" fontWeight="bold">
        <CalendarDays size="1rem" />
        <DateField
          source="event.begin_datetime"
          label="Date"
          locales="fr-FR"
          fontWeight="bold"
          options={{year: "numeric", month: "short", day: "numeric"}}
        />
      </Box>
    </Tooltip>
  );
};
