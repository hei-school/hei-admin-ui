import {PALETTE_COLORS} from "@/haTheme";
import {formatDate} from "@/utils/date";
import {Button, Chip, Popover, TextField, Typography} from "@mui/material";
import {CalendarDays} from "lucide-react";
import {FC, useState} from "react";
import {useListContext} from "react-admin";
import {APPLY_BUTTON_SX, DATE_CHIP_SX} from "../components/StyleFeeStat";
import {buildDateRange, toMonthInput} from "./FeeStatsUtils";

export const DateRangePopover: FC = () => {
  const {filterValues, setFilters} = useListContext();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [tempFrom, setTempFrom] = useState("");
  const [tempTo, setTempTo] = useState("");

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setTempFrom(toMonthInput(filterValues?.monthFrom ?? ""));
    setTempTo(toMonthInput(filterValues?.monthTo ?? ""));
    setAnchor(e.currentTarget);
  };

  const handleApply = () => {
    const {monthFrom, monthTo} = buildDateRange(tempFrom, tempTo);
    setFilters({...filterValues, monthFrom, monthTo}, {});
    setAnchor(null);
  };

  if (!filterValues?.monthFrom || !filterValues?.monthTo) return null;

  return (
    <>
      <Chip
        icon={<CalendarDays size={13} />}
        label={
          <span>
            <strong>{formatDate(filterValues.monthFrom, false)}</strong>
            {" → "}
            <strong>{formatDate(filterValues.monthTo, false)}</strong>
          </span>
        }
        size="small"
        onClick={handleOpen}
        sx={DATE_CHIP_SX}
      />

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
        transformOrigin={{vertical: "top", horizontal: "left"}}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            minWidth: 260,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Typography fontWeight={700} fontSize="0.85rem" color="text.secondary">
          Modifier la période
        </Typography>

        <TextField
          label="Du"
          type="month"
          size="small"
          value={tempFrom}
          onChange={(e) => setTempFrom(e.target.value)}
          InputLabelProps={{shrink: true}}
          fullWidth
        />

        <TextField
          label="Au"
          type="month"
          size="small"
          value={tempTo}
          onChange={(e) => setTempTo(e.target.value)}
          InputLabelProps={{shrink: true}}
          fullWidth
        />

        <Button
          variant="contained"
          size="small"
          disabled={!tempFrom || !tempTo}
          onClick={handleApply}
          sx={APPLY_BUTTON_SX(PALETTE_COLORS.primary)}
        >
          Appliquer
        </Button>
      </Popover>
    </>
  );
};
