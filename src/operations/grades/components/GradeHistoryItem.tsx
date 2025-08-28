import {PALETTE_COLORS} from "@/haTheme";
import {formatDate} from "@/utils/date";
import {GradeHistory} from "@haapi-b0fc7615/typescript-client";
import {
  Comment as CommentIcon,
  History as HistoryIcon,
  TrendingUp as TrendIcon,
} from "@mui/icons-material";
import {Avatar, Box, Card, CardContent, Chip, Typography} from "@mui/material";
import {Clock} from "lucide-react";

interface GradeHistoryItemProps {
  historyItem: GradeHistory;
  isLatest: boolean;
  isLast: boolean;
}

export const GradeHistoryItem = ({
  historyItem,
  isLatest,
  isLast,
}: GradeHistoryItemProps) => {
  const date = formatDate(historyItem.created_at);
  const hasComment = historyItem.comment && historyItem.comment !== "string";

  return (
    <Box display="flex" gap={2} mb={isLast ? 0 : 3}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minWidth="40px"
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: isLatest ? PALETTE_COLORS.yellow : PALETTE_COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isLatest
              ? `0 0 0 4px ${PALETTE_COLORS.yellow}20`
              : "none",
            color: "white",
          }}
        >
          {isLatest ? (
            <TrendIcon fontSize="small" />
          ) : (
            <HistoryIcon fontSize="small" />
          )}
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              height: 60,
              bgcolor: PALETTE_COLORS.grey + "30",
              mt: 1,
            }}
          />
        )}
      </Box>
      <Box flex={1}>
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${
              isLatest ? PALETTE_COLORS.yellow : PALETTE_COLORS.grey
            }20`,
            borderRadius: 2,
            bgcolor: isLatest
              ? `${PALETTE_COLORS.yellow}08`
              : "background.paper",
          }}
        >
          <CardContent sx={{"p": 2, "&:last-child": {pb: 2}}}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: isLatest
                      ? PALETTE_COLORS.yellow
                      : PALETTE_COLORS.primary,
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                  }}
                >
                  {historyItem.score}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Note: {historyItem.score}/20
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isLatest ? "Note actuelle" : "Ancienne note"}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={isLatest ? "ACTUEL" : "HISTORIQUE"}
                size="small"
                sx={{
                  bgcolor: isLatest
                    ? PALETTE_COLORS.yellow
                    : PALETTE_COLORS.grey + "20",
                  color: isLatest ? "white" : "text.secondary",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                }}
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              mb={hasComment ? 1.5 : 0}
            >
              <Clock size={14} color={PALETTE_COLORS.grey} />
              <Typography variant="caption" color="text.secondary">
                {date}
              </Typography>
            </Box>
            {hasComment && (
              <Box
                sx={{
                  bgcolor: PALETTE_COLORS.grey + "10",
                  borderRadius: 1,
                  p: 1.5,
                  borderLeft: `3px solid ${PALETTE_COLORS.primary}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <CommentIcon
                    sx={{fontSize: 16, color: PALETTE_COLORS.primary}}
                  />
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color="text.secondary"
                  >
                    Commentaire
                  </Typography>
                </Box>
                <Typography variant="body2">{historyItem.comment}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
