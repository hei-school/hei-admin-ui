import authProvider from "@/providers/authProvider";
import {EventAvailable, EventBusy, HowToReg} from "@mui/icons-material";
import {Box, Button, Chip, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {useCreate, useNotify, useRecordContext, useRefresh} from "react-admin";

interface InscriptionButtonProps {
  onSuccess?: (record: any) => void;
}

export const InscriptionButton = ({onSuccess}: InscriptionButtonProps) => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [create, {isLoading}] = useCreate();
  const whoami = authProvider.getCachedWhoami();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (record) {
      const examDate = new Date(record.session?.date_to);
      setIsPast(examDate < new Date());

      const registeredFromRecord =
        record.inscriptions?.includes(whoami?.id) || false;

      const savedInscriptions = localStorage.getItem("inscribed-retake-exams");
      const inscribedRecords = savedInscriptions
        ? JSON.parse(savedInscriptions)
        : [];
      const registeredFromStorage = inscribedRecords.some(
        (item: any) =>
          item.course?.code === record.course?.code &&
          item.session?.id === record.session?.id
      );

      setIsRegistered(registeredFromRecord || registeredFromStorage);
    }
  }, [record, whoami]);

  if (!record) return null;

  const handleInscription = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await create("retakeExams", {
        data: {
          course_id: record.course.id,
          session_id: record.session.id,
          student_id: whoami?.id,
        },
        meta: {
          onSuccess: {
            notification: {
              body: "Inscription réussie ! Frais non payés",
              level: "info",
            },
            redirectTo: false,
          },
        },
      });

      notify("Inscription réussie ! Frais non payés", {type: "info"});

      setIsProcessed(true);
      setIsRegistered(true);

      if (onSuccess) {
        onSuccess(record);
      }

      refresh();
    } catch (e: any) {
      notify(`Erreur : ${e.message}`, {type: "error"});
    }
  };

  if (isPast) {
    return (
      <Chip
        icon={<EventBusy />}
        label="Rattrapage terminé"
        color="default"
        variant="outlined"
        size="small"
        sx={{fontSize: 11, height: 24}}
      />
    );
  }

  if (isRegistered || isProcessed) {
    return (
      <Box display="flex" alignItems="center">
        <Chip
          icon={<EventAvailable />}
          label="Déjà inscrit"
          color="success"
          variant="outlined"
          size="small"
          sx={{mr: 1, fontSize: 11, height: 24}}
        />
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      startIcon={
        isLoading ? (
          <CircularProgress size={12} />
        ) : (
          <HowToReg fontSize="small" />
        )
      }
      onClick={handleInscription}
      disabled={isLoading || isProcessed}
      type="button"
      sx={{
        "textTransform": "none",
        "fontSize": 12,
        "paddingX": 1.8,
        "paddingY": 0.5,
        "minHeight": 28,
        "borderRadius": 1.5,
        "boxShadow": "0 1px 2px rgba(0,0,0,0.08)",
        "&:hover": {
          boxShadow: "0 2px 5px rgba(0,0,0,0.12)",
        },
      }}
    >
      {isLoading ? "Traitement..." : "S'inscrire"}
    </Button>
  );
};
