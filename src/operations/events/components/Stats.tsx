import {FC} from "react";
import {Box, Stack, Typography} from "@mui/material";

import SvgIcon from "@mui/material/SvgIcon";
import {People, PersonOff, AccessTime} from "@mui/icons-material";
import {EventStats} from "@haapi/typescript-client";

type SvgIconComponent = typeof SvgIcon;

export const StatCard = ({stats}: {stats: EventStats}) => {
  return (
    <Stack
      sx={{width: "100%", maxWidth: 350, boxSizing: "border-box"}}
      gap={0.5}
      direction="row"
    >
      <StatBox
        Icon={People}
        label="Présent"
        value={stats.present || 0}
        color="#d9f4d2"
      />
      <StatBox
        Icon={PersonOff}
        label="Absent"
        value={stats.missing || 0}
        color="#f4d2d2"
      />
      <StatBox
        Icon={AccessTime}
        label="En retard"
        value={stats.late || 0}
        color="#f2f4d2"
      />
    </Stack>
  );
};

interface StatProps {
  Icon: SvgIconComponent;
  value: number;
  label: string;
  color: string;
}

export const StatBox: FC<StatProps> = ({Icon, value, label, color}) => (
  <Box
    sx={{
      display: "flex",
      p: 0.5,
      alignItems: "center",
      borderRadius: 1,
      flexDirection: "column",
      width: "100%",
      bgcolor: `${color}`,
    }}
  >
    <Stack direction="row" alignItems="center" gap={1}>
      {<Icon fontSize="small" />}
      <Typography sx={{color: "text.secondary"}}>{value}</Typography>
    </Stack>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);
