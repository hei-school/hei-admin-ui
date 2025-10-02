import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";
import retakeExamProvider from "@/providers/retakeExamProvider";
import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {CheckCircle, HowToReg} from "@mui/icons-material";
import {Button, Chip, CircularProgress} from "@mui/material";
import {useState} from "react";
import {Confirm, useNotify, useRecordContext, useRefresh} from "react-admin";

const BUTTON_STYLE = {
  textTransform: "none",
  fontSize: 12,
  px: 1.8,
  py: 0.5,
  minHeight: 28,
  borderRadius: 1.5,
} as const;

const CHIP_STYLE = {fontSize: 11, height: 24} as const;

type EnrollButtonProps = {
  onSuccess?: (retakeExam: RetakeExam) => void;
  alreadyInscribed: (retakeExam: RetakeExam) => boolean;
};
export const EnrollButton = ({
  onSuccess,
  alreadyInscribed,
}: EnrollButtonProps) => {
  const userId = authProvider.getCachedWhoami()?.id;
  const retakeExam = useRecordContext<RetakeExam>();
  const notify = useNotify();
  const refresh = useRefresh();
  const [confirmOpen, setConfirmOpen] = useToggle(false);
  const [isLoading, setIsLoading] = useToggle(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  if (!retakeExam) return null;
  const isInscribed = alreadyInscribed(retakeExam) || isEnrolled;
  if (isInscribed) {
    return (
      <Chip
        icon={<CheckCircle />}
        label="Déjà inscrit"
        color="success"
        variant="outlined"
        size="small"
        sx={CHIP_STYLE}
      />
    );
  }
  const handleEnroll = async () => {
    if (!retakeExam || !userId) return;
    const payloadArray = [
      {
        course_id: retakeExam.course?.id ?? "",
        session_id: retakeExam.session?.id ?? "",
        student_id: userId,
      },
    ];
    try {
      setIsLoading(true);
      await retakeExamProvider.saveOrUpdate(
        retakeExam.session?.id ?? "",
        payloadArray
      );
      setIsEnrolled(true);
      notify("Inscription réussie !", {type: "info"});
      onSuccess?.(retakeExam);
      refresh();
      setConfirmOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      notify(
        "Une erreur est survenue lors de l'inscription. Merci de réessayer plus tard.",
        {type: "error"}
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        variant="contained"
        size="small"
        startIcon={
          isLoading ? (
            <CircularProgress size={14} />
          ) : (
            <HowToReg fontSize="small" />
          )
        }
        onClick={(e) => {
          e.stopPropagation();
          setConfirmOpen(true);
        }}
        sx={BUTTON_STYLE}
        disabled={isLoading}
      >
        {isLoading ? "En cours de vérification..." : "S'inscrire"}
      </Button>

      <Confirm
        isOpen={confirmOpen}
        title="Confirmation"
        content={`Voulez-vous vraiment vous inscrire au rattrapage de "${retakeExam.course?.name}" (${retakeExam.session?.title || "Session"}) ?`}
        onConfirm={handleEnroll}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
};
