import {PALETTE_COLORS} from "@/haTheme";
import {Dialog} from "@/ui/components";
import {GradeHistory} from "@haapi-b0fc7615/typescript-client";
import {History as HistoryIcon} from "@mui/icons-material";
import {Alert, Box, CircularProgress, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {GradeHistoryItem} from "./GradeHistoryItem";

interface GradeHistoryDialogProps {
  onClose: () => void;
  studentId: string;
  examId: string;
}

export const GradeHistoryDialog = ({
  onClose,
  studentId,
  examId,
}: GradeHistoryDialogProps) => {
  const [historyData, setHistoryData] = useState<GradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FIXME: Use the API to fetch the history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockData: GradeHistory[] = [
          {
            created_at: new Date("2025-08-28T06:25:53.812Z"),
            score: 12.5,
            comment: "Bonne compréhension des concepts de base...",
          },
          {
            created_at: new Date("2025-08-27T14:30:22.156Z"),
            score: 10.0,
            comment: "Première correction - travail à améliorer",
          },
          {
            created_at: new Date("2025-08-26T09:15:45.789Z"),
            score: 8.5,
            comment: "Note initiale",
          },
        ];
        setHistoryData(
          mockData.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
            const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
            return +dateB - +dateA;
          })
        );
      } catch {
        setError("Erreur lors du chargement de l'historique");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [studentId, examId]);

  return (
    <Dialog
      title="Historique des modifications"
      open
      onClose={onClose}
      maxWidth="md"
    >
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress
            size={40}
            sx={{color: PALETTE_COLORS.primary, mb: 2}}
          />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{borderRadius: 2}}>
          {error}
        </Alert>
      ) : historyData.length === 0 ? (
        <Box textAlign="center" py={8}>
          <HistoryIcon sx={{fontSize: 48, color: PALETTE_COLORS.grey, mb: 2}} />
          <Typography variant="h6" color="text.secondary">
            Aucun historique disponible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette note n'a pas encore été modifiée.
          </Typography>
        </Box>
      ) : (
        <Box p={2}>
          {historyData.map((item, index) => (
            <GradeHistoryItem
              key={item.created_at?.toISOString() ?? `history-${index}`}
              historyItem={item}
              isLatest={index === 0}
              isLast={index === historyData.length - 1}
            />
          ))}
        </Box>
      )}
    </Dialog>
  );
};
