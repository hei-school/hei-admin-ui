import {PALETTE_COLORS} from "@/haTheme";
import {useFeesToArchive} from "@/operations/fees/hooks/useFeesToArchive";
import {alpha, Box, Chip, Typography} from "@mui/material";
import {Archive, Hourglass, MoveRight, XCircle} from "lucide-react";
import {Button, Link} from "react-admin";

const ACCENT_COLOR = "#3B82F6";
const TO_ARCHIVE_COLOR = PALETTE_COLORS.warning;
const REJECTED_COLOR = PALETTE_COLORS.red;

export const PendingFeeArchiving = ({animate}: {animate: boolean}) => {
  const {toArchiveFees, rejectedFees} = useFeesToArchive();
  const toArchiveCount = toArchiveFees.length;
  const rejectedCount = rejectedFees.length;

  return (
    <Box
      sx={{
        mb: 4,
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.5s ease-out 0.75s",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <Box display="flex" gap="1rem" alignItems="center">
          <Archive color={ACCENT_COLOR} />
          <Typography variant="h6" fontWeight="bold">
            Frais à archiver
          </Typography>
        </Box>
        <Box display="flex" gap="0.5rem">
          <Chip
            icon={<Hourglass size={14} />}
            label={`${toArchiveCount} à archiver`}
            size="small"
            sx={{
              "fontWeight": "bold",
              "bgcolor": alpha(TO_ARCHIVE_COLOR, 0.1),
              "color": TO_ARCHIVE_COLOR,
              "border": `1px solid ${alpha(TO_ARCHIVE_COLOR, 0.2)}`,
              "& .MuiChip-icon": {color: TO_ARCHIVE_COLOR},
            }}
          />
          <Chip
            icon={<XCircle size={14} />}
            label={`${rejectedCount} rejetés`}
            size="small"
            sx={{
              "fontWeight": "bold",
              "bgcolor": alpha(REJECTED_COLOR, 0.1),
              "color": REJECTED_COLOR,
              "border": `1px solid ${alpha(REJECTED_COLOR, 0.2)}`,
              "& .MuiChip-icon": {color: REJECTED_COLOR},
            }}
          />
        </Box>
      </Box>
      <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
        <Button
          component={Link}
          variant="text"
          to={"/fees-to-archive"}
          endIcon={
            <MoveRight
              style={{
                fontWeight: 700,
              }}
            />
          }
          sx={{
            "textTransform": "none",
            "padding": "0.3rem 0.8rem",
            "color": ACCENT_COLOR,
            "&:hover": {
              borderColor: PALETTE_COLORS.yellow,
              bgcolor: alpha(PALETTE_COLORS.yellow, 0.1),
              color: PALETTE_COLORS.yellow,
            },
          }}
          label="Voir les frais à archiver"
        />
      </Box>
    </Box>
  );
};
