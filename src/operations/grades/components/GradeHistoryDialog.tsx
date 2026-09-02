import {PALETTE_COLORS} from "@/haTheme";
import correctGradeProvider from "@/providers/correctGradeProvider";
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
  gradeId?: string;
}

export const GradeHistoryDialog = ({
  onClose,
  studentId,
  examId,
  gradeId,
}: GradeHistoryDialogProps) => {
  const [historyData, setHistoryData] = useState<GradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!gradeId) {
        setError("ID de note manquant pour récupérer l'historique");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        console.log("Fetching grade history for gradeId:", gradeId);
        const response = await correctGradeProvider.getList(
          1,
          50,
          {},
          {gradeId}
        );
        console.log("Grade history response:", response);

        const sortedData = response.data.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return +dateB - +dateA;
        });

        setHistoryData(sortedData);
      } catch (error) {
        console.error("Error fetching grade history:", error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setError(`Erreur lors du chargement de l'historique: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [studentId, examId, gradeId]);

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
              key={`history-${index}`}
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
