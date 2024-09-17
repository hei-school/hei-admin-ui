import {FC, useState} from "react";
import {useListFilterContext} from "react-admin";
import {Box, Typography, MenuItem, Menu, Button} from "@mui/material";
import {Tune} from "@mui/icons-material";
import {LetterStatus} from "@haapi/typescript-client";
import {PALETTE_COLORS} from "@/haTheme";

export function LetterActions() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <ActionField count="20" value="Tous" />
        <ActionField count="15" value="Accepter" />
        <ActionField count="2" value="Refuser" />
      </Box>
      <Box>
        <Button
          startIcon={<Tune />}
          onClick={handleStatusClick}
          sx={{
            "borderRadius": "8px",
            "padding": "0.5rem 1rem",
            "fontWeight": "600",
            "color": PALETTE_COLORS.primary,
            "backgroundColor": "#f5e4b5",
            "&:hover": {
              backgroundColor: "#f2db9c",
            },
          }}
        >
          Filtre
        </Button>
        <StatusFilter anchorEl={anchorEl} handleClose={handleClose} />
      </Box>
    </Box>
  );
}

const ActionField: FC<{value: string; count: string}> = ({value, count}) => (
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

export const StatusFilter: FC<{
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}> = ({anchorEl, handleClose}) => {
  const {setFilters, filterValues, displayedFilters} = useListFilterContext();
  const handleStatusSelect = (status: LetterStatus) => {
    setFilters({...filterValues, status}, displayedFilters);
    handleClose();
  };
  const isStatusFilteActive = (status: LetterStatus) => {
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

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={handleResetFilters}>Tous</MenuItem>
      <MenuItem
        disabled={isStatusFilteActive(LetterStatus.PENDING)}
        onClick={() => handleStatusSelect(LetterStatus.PENDING)}
        color="black"
        sx={
          isStatusFilteActive(LetterStatus.PENDING) ? showIndication : undefined
        }
      >
        En attente
      </MenuItem>
      <MenuItem
        disabled={isStatusFilteActive(LetterStatus.RECEIVED)}
        onClick={() => handleStatusSelect(LetterStatus.RECEIVED)}
        sx={
          isStatusFilteActive(LetterStatus.RECEIVED)
            ? showIndication
            : undefined
        }
      >
        Accepté
      </MenuItem>
      <MenuItem
        disabled={isStatusFilteActive(LetterStatus.REJECTED)}
        onClick={() => handleStatusSelect(LetterStatus.REJECTED)}
        sx={
          isStatusFilteActive(LetterStatus.REJECTED)
            ? showIndication
            : undefined
        }
      >
        Réfusé
      </MenuItem>
    </Menu>
  );
};
