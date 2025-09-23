import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";
import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {CheckCircle, HowToReg} from "@mui/icons-material";
import {Button, Chip, CircularProgress} from "@mui/material";
import {useState} from "react";
import {Confirm, useCreate, useNotify, useRecordContext} from "react-admin";

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
  onSuccess: (retakeExam: RetakeExam) => void;
  alreadyInscribed: (retakeExam: RetakeExam) => boolean;
};

export const EnrollButton = ({
  onSuccess,
  alreadyInscribed,
}: EnrollButtonProps) => {
  const {id: currentUserId} = authProvider.getCachedWhoami();
  const retakeExam = useRecordContext<RetakeExam>();
  const notify = useNotify();
  const [create] = useCreate();

  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useToggle(false);

  if (!retakeExam) return null;

  const handleEnroll = async () => {
    if (!retakeExam || !currentUserId) return;
    const payload = {
      course_id: retakeExam.course?.id ?? "",
      session_id: retakeExam.session?.id ?? "",
      student_id: currentUserId,
    };
    try {
      setLoading(true);
      await create(
        "retakeExams",
        {data: payload},
        {
          onSuccess: () => {
            notify("Inscription réussie !", {type: "info"});
            onSuccess(retakeExam);
            setConfirmOpen(false);
          },
          onError: () => {
            notify(
              "Une erreur est survenue lors de l'inscription. Merci de réessayer plus tard.",
              {type: "error"}
            );
          },
          onSettled: () => setLoading(false),
        }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de l'inscription :", error.message);
      } else {
        console.error("Erreur inattendue :", error);
      }

      notify(
        "Une erreur est survenue lors de l'inscription. Merci de réessayer plus tard.",
        {type: "error"}
      );
      setLoading(false);
    }

    if (alreadyInscribed(retakeExam)) {
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
    return (
      <>
        <Button
          variant="contained"
          size="small"
          startIcon={<HowToReg fontSize="small" />}
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          sx={BUTTON_STYLE}
          disabled={loading}
        >
          {loading ? <CircularProgress size={14} /> : "S'inscrire"}
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
};
