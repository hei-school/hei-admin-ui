import {NOOP_ID} from "@/utils/constants";
import {Box} from "@mui/material";
import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarX,
} from "lucide-react";
import {FC} from "react";
import {useGetOne} from "react-admin";
import {ListHeader} from "../common/components";

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
      title: "Abscents",
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
        title="Statistiques des abscences"
        cardContents={eventsHeaderContent!}
      />
    </Box>
  );
};
