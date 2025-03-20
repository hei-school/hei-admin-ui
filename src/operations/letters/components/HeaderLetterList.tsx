import {PALETTE_COLORS} from "@/haTheme";
import {LetterStats, LetterStatus} from "@haapi/typescript-client";
import {
  alpha,
  Box,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {FC, useState} from "react";
import {useListFilterContext} from "react-admin";

const STATUS_COLORS = {
  RECEIVED: {
    main: "#4caf50",
    light: "rgba(76, 175, 80, 0.1)",
    name: "Accepté",
  },
  REJECTED: {
    main: "#f44336",
    light: "rgba(244, 67, 54, 0.08)",
    name: "Rejeté",
  },
  PENDING: {
    main: PALETTE_COLORS.yellow,
    light: "rgba(255, 193, 7, 0.08)",
    name: "En attente",
  },
  TOTAL: {
    main: "#2196f3",
    light: "rgba(33, 150, 243, 0.08)",
    name: "Total",
  },
};

export const HeaderLetterList: FC<{stats: LetterStats & {total?: number}}> = ({
  stats,
}) => {
  const isSmall = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        "backgroundColor": PALETTE_COLORS.white,
        "display": "flex",
        "flexDirection": isSmall ? "column" : "row",
        "alignItems": isSmall ? "flex-start" : "center",
        "justifyContent": "flex-start",
        "padding": isSmall ? "0.6rem" : "0.6rem 1.2rem",
        "borderRadius": "12px",
        "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "transition": "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        },
        "position": "relative",
        "overflow": "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          background: "linear-gradient(to bottom, #2196f3, #1976d2)",
          borderRadius: "4px 0 0 4px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          alignItems: isSmall ? "flex-start" : "center",
          justifyContent: "flex-start",
          width: "100%",
          gap: isSmall ? "0.5rem" : "1.2rem",
          flexWrap: "wrap",
          paddingLeft: isSmall ? "0" : "0.5rem",
        }}
      >
        <LetterStatusField count={stats?.total!} value="Total" status="TOTAL" />
        <Divider
          orientation={isSmall ? "horizontal" : "vertical"}
          flexItem
          sx={{
            display: isSmall ? "none" : "block",
            height: isSmall ? "1px" : "24px",
            margin: isSmall ? "0.3rem 0" : "0",
            opacity: 0.3,
          }}
        />
        <LetterStatusField
          count={stats?.received!}
          value="Accepté"
          status="RECEIVED"
        />
        <Divider
          orientation={isSmall ? "horizontal" : "vertical"}
          flexItem
          sx={{
            display: isSmall ? "none" : "block",
            height: isSmall ? "1px" : "24px",
            margin: isSmall ? "0.3rem 0" : "0",
            opacity: 0.3,
          }}
        />
        <LetterStatusField
          count={stats?.pending!}
          value="En attente"
          status="PENDING"
        />
        <Divider
          orientation={isSmall ? "horizontal" : "vertical"}
          flexItem
          sx={{
            display: isSmall ? "none" : "block",
            height: isSmall ? "1px" : "24px",
            margin: isSmall ? "0.3rem 0" : "0",
            opacity: 0.3,
          }}
        />
        <LetterStatusField
          count={stats?.rejected!}
          value="Refusé"
          status="REJECTED"
        />
      </Box>
    </Box>
  );
};

const LetterStatusField: FC<{value: string; count: number; status: string}> = ({
  value,
  count,
  status,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const statusColor = STATUS_COLORS[status as keyof typeof STATUS_COLORS];
  const isSmall = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        "display": "flex",
        "flexDirection": "row",
        "alignItems": "center",
        "justifyContent": "flex-start",
        "gap": "0.5rem",
        "padding": "4px 6px",
        "color": PALETTE_COLORS.typography.black,
        "borderRadius": "6px",
        "transition": "all 0.2s ease",
        "backgroundColor": isHovered
          ? alpha(statusColor.main, 0.08)
          : "transparent",
        "width": isSmall ? "100%" : "auto",
        "&:hover": {
          backgroundColor: alpha(statusColor.main, 0.08),
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: statusColor.main,
          marginRight: "4px",
          transition: "all 0.2s ease",
          transform: isHovered ? "scale(1.2)" : "scale(1)",
          boxShadow: isHovered
            ? `0 0 6px ${alpha(statusColor.main, 0.5)}`
            : "none",
        }}
      />
      <Typography
        variant="body2"
        fontWeight="600"
        sx={{
          fontSize: "0.85rem",
          transition: "all 0.2s ease",
          color: alpha(PALETTE_COLORS.typography.black, 0.85),
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {value}
      </Typography>
      <Chip
        label={count}
        size="small"
        sx={{
          "fontWeight": "600",
          "backgroundColor": alpha(statusColor.main, 0.1),
          "color": statusColor.main,
          "borderColor": alpha(statusColor.main, 0.2),
          "borderRadius": "4px",
          "height": "22px",
          "minWidth": "32px",
          "transition": "all 0.2s ease",
          "transform": isHovered ? "scale(1.05)" : "scale(1)",
          "boxShadow": isHovered
            ? `0 2px 4px ${alpha(statusColor.main, 0.15)}`
            : "none",
          "& .MuiChip-label": {
            padding: "0 8px",
          },
        }}
      />
    </Box>
  );
};

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
      width: "6px",
      position: "absolute",
      height: "6px",
      bgcolor: "#2196f3",
      top: "2px",
      borderRadius: "50%",
      right: "5px",
      boxShadow: "0 0 4px rgba(33, 150, 243, 0.5)",
    },
  };

  const statuses = [
    {label: "Tous", value: null, onClick: handleResetFilters},
    {label: "En cours", value: LetterStatus.PENDING},
    {label: "Accepté", value: LetterStatus.RECEIVED},
    {label: "Refusé", value: LetterStatus.REJECTED},
  ] as const;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(!!anchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: "8px",
          padding: "4px",
          minWidth: "150px",
        },
      }}
    >
      {statuses.map(({label, value}) => {
        const statusKey = value || "TOTAL";
        const statusColor =
          STATUS_COLORS[statusKey as keyof typeof STATUS_COLORS];

        return (
          <MenuItem
            key={label}
            disabled={value! && isStatusFilterActive(value)}
            onClick={() => handleStatusSelect(value as LetterStatus)}
            sx={{
              ...(value && isStatusFilterActive(value) ? showIndication : {}),
              "borderRadius": "6px",
              "margin": "2px 0",
              "padding": "6px 12px",
              "transition": "all 0.2s ease",
              "fontSize": "0.875rem",
              "&:hover": {
                backgroundColor: alpha(statusColor.main, 0.1),
              },
              "&.Mui-selected": {
                "backgroundColor": alpha(statusColor.main, 0.15),
                "&:hover": {
                  backgroundColor: alpha(statusColor.main, 0.2),
                },
              },
            }}
          >
            {label}
          </MenuItem>
        );
      })}
    </Menu>
  );
};
