import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";
import retakeExamProvider from "@/providers/retakeExamProvider";
import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {CheckCircle, HowToReg} from "@mui/icons-material";
import {Button, Chip, CircularProgress} from "@mui/material";
import {useState} from "react";
import {Confirm, useNotify, useRecordContext} from "react-admin";

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
  onSuccess: (record: RetakeExam) => void;
  alreadyInscribed: (record: RetakeExam) => boolean;
};

export const EnrollButton = ({
  onSuccess,
  alreadyInscribed,
}: EnrollButtonProps) => {
  const {id: currentUserId} = authProvider.getCachedWhoami();
  const record = useRecordContext<RetakeExam>();
  const notify = useNotify();

  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useToggle(false);

  if (!record) return null;
  const handleEnroll = async () => {
    if (!record || currentUserId) return;
    const payload = [
      {
        ...(record.id ? {id: record.id} : {}),
        course_id: record.course?.id ?? "",
        session_id: record.session?.id ?? "",
        student_id: currentUserId,
      },
    ];
    try {
      setLoading(true);
      await retakeExamProvider.saveOrUpdate(record.session?.id ?? "", payload);
      notify("Inscription réussie !", {type: "info"});

      onSuccess(record);
      setConfirmOpen(false);
    } catch (error) {
      notify(`Erreur : ${(error as Error).message || String(error)}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  if (alreadyInscribed(record)) {
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
        content={`Voulez-vous vraiment vous inscrire au rattrapage de "${record.course?.name}" (${record.session?.title || "Session"}) ?`}
        onConfirm={handleEnroll}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
};
