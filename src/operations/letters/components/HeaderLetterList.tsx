import {PALETTE_COLORS} from "@/haTheme";
import {LetterStats, LetterStatus} from "@haapi/typescript-client";
import {Box, Menu, MenuItem, Typography} from "@mui/material";
import {FC} from "react";
import {useListFilterContext} from "react-admin";

export const HeaderLetterList: FC<{stats: LetterStats & {total?: number}}> = ({
  stats,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: PALETTE_COLORS.white,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: " 0.4rem 1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LetterStatusField count={stats?.total!} value="Total" />
        <LetterStatusField count={stats?.received!} value="Accepté" />
        <LetterStatusField count={stats?.pending!} value="en attente" />
        <LetterStatusField count={stats?.rejected!} value="Refusé" />
      </Box>
    </Box>
  );
};

const LetterStatusField: FC<{value: string; count: number}> = ({
  value,
  count,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      padding: "6px 10px",
      color: PALETTE_COLORS.typography,
    }}
  >
    <Typography variant="subtitle1" fontWeight="600">
      {value}
    </Typography>
    <Box
      sx={{
        border: "1px solid",
        padding: "8px 14px",
        borderRadius: "4px",
        borderColor: "#80d8eb",
        backgroundColor: "#cceff7",
        fontWeight: "800",
      }}
    >
      {count}
    </Box>
  </Box>
);

export const LetterStatusFilter: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}> = ({anchorEl, handleClose}) => {
  const {setFilters, filterValues, displayedFilters} = useListFilterContext();
  const handleStatusSelect = (status: LetterStatus) => {
    setFilters({...filterValues, status}, displayedFilters);
    handleClose();
  };
  const isStatusFilterActive = (status: LetterStatus) => {
    return filterValues.status === status;
  };
  const handleResetFilters = () => {
    setFilters({}, displayedFilters);
    handleClose();
  };

  const showIndication = {
    "position": "relative",
    "display": "block !important",
    "::after": {
      content: '""',
      display: "block",
      width: "7px",
      position: "absolute",
      height: "7px",
      bgcolor: "blue",
      top: "2px",
      borderRadius: "50%",
      right: "5px",
    },
  };

  const statuses = [
    {label: "Tous", value: null, onClick: handleResetFilters},
    {label: "En cours", value: LetterStatus.PENDING},
    {label: "Accepté", value: LetterStatus.RECEIVED},
    {label: "Refusé", value: LetterStatus.REJECTED},
  ] as const;

  return (
    <Menu anchorEl={anchorEl} open={Boolean(!!anchorEl)} onClose={handleClose}>
      {statuses.map(({label, value}) => (
        <MenuItem
          key={label}
          disabled={value! && isStatusFilterActive(value)}
          onClick={() => handleStatusSelect(value as LetterStatus)}
          sx={value && isStatusFilterActive(value) ? showIndication : undefined}
        >
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
};
