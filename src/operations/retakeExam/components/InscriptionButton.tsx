import authProvider from "@/providers/authProvider";
import {EventAvailable, EventBusy, HowToReg} from "@mui/icons-material";
import {Box, Button, Chip, CircularProgress} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {
  Confirm,
  useCreate,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";

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
  const [openConfirm, setOpenConfirm] = useState(false);

  const storageKey = useMemo(
    () => `inscribed-retake-exams-${whoami?.id}`,
    [whoami?.id]
  );

  const getSavedInscriptions = (): any[] => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  };

  const saveInscription = (newRecord: any) => {
    const updated = [...getSavedInscriptions(), newRecord];
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  useEffect(() => {
    if (!record || !whoami?.id) return;

    const examDate = new Date(record.session?.date_to);
    setIsPast(examDate < new Date());

    const registeredFromRecord =
      record.inscriptions?.includes(whoami.id) || false;

    const registeredFromStorage = getSavedInscriptions().some(
      (item: any) =>
        item.course?.code === record.course?.code &&
        item.session?.id === record.session?.id
    );

    setIsRegistered(registeredFromRecord || registeredFromStorage);
  }, [record, whoami, storageKey]);

  if (!record) return null;

  const handleInscription = async () => {
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

      saveInscription(record);
      setIsProcessed(true);
      setIsRegistered(true);

      notify("Inscription réussie ! Frais non payés", {type: "info"});
      onSuccess?.(record);
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
    <>
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenConfirm(true);
        }}
        disabled={isLoading || isProcessed}
        type="button"
        sx={{
          "textTransform": "none",
          "fontSize": 12,
          "px": 1.8,
          "py": 0.5,
          "minHeight": 28,
          "borderRadius": 1.5,
          "boxShadow": "0 1px 2px rgba(0,0,0,0.08)",
          "&:hover": {boxShadow: "0 2px 5px rgba(0,0,0,0.12)"},
        }}
      >
        {isLoading ? "Traitement..." : "S'inscrire"}
      </Button>

      <Confirm
        isOpen={openConfirm}
        title="Confirmation"
        content={`Voulez-vous vraiment vous inscrire au rattrapage de "${record.course?.name}" (${record.session?.title || "Session"}) ?`}
        onConfirm={handleInscription}
        onClose={() => setOpenConfirm(false)}
      />
    </>
  );
};
