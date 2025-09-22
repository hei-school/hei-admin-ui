import authProvider from "@/providers/authProvider";
import { EventAvailable, EventBusy, HowToReg } from "@mui/icons-material";
import { Box, Button, Chip, CircularProgress } from "@mui/material";
import { useNotify, useRecordContext, useStore, useCreate, Confirm } from "react-admin";
import { useQueryClient } from "react-query";
import { useToggle } from "../../../hooks";
import { useEffect } from "react";

interface EnrollButtonProps {
  onSuccess?: (record: any) => void;
}

const ENROLL_BUTTON_SX = {
  textTransform: "none",
  fontSize: 12,
  px: 1.8,
  py: 0.5,
  minHeight: 28,
  borderRadius: 1.5,
  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
  "&:hover": { boxShadow: "0 2px 5px rgba(0,0,0,0.12)" },
};

const CHIP_PAST_SX = { fontSize: 11, height: 24 };
const CHIP_REGISTERED_SX = { mr: 1, fontSize: 11, height: 24 };

export const EnrollButton = ({ onSuccess }: EnrollButtonProps) => {
  const whoami = authProvider.getCachedWhoami();
  const record = useRecordContext();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [create, { isLoading }] = useCreate();

  const [isRegistered, setIsRegistered] = useToggle(false);
  const [isPast, setIsPast] = useToggle(false);
  const [openConfirm, setOpenConfirm] = useToggle(false);

  const storageKey = `inscribed-retake-exams-${whoami?.id}`;
  const [enrolledExams, setEnrolledExams] = useStore<any[]>(storageKey, []);

  if (!record) return null;

  useEffect(() => {
    const examDate = new Date(record.session?.date_to);
    setIsPast(examDate < new Date());

    const alreadyRegistered =
      enrolledExams.some(
        (item: any) =>
          item.course?.code === record.course?.code &&
          item.session?.id === record.session?.id
      ) || record.EnrollButton?.includes(whoami?.id);

    setIsRegistered(alreadyRegistered);
  }, [record, enrolledExams, whoami?.id, setIsPast, setIsRegistered]);

  const saveEnroll = (newRecord: any) => setEnrolledExams([...enrolledExams, newRecord]);

  const enrollInRetakeExam = async () => {
    try {
      await create("retakeExams", {
        data: {
          course_id: record.course.id,
          session_id: record.session.id,
          student_id: whoami?.id,
        },
      });

      saveEnroll(record);
      setIsRegistered(true);
      queryClient.invalidateQueries({ queryKey: ["retakeExams"] });
      if (record?.id) {
        queryClient.invalidateQueries({ queryKey: [record.resource, "getOne", { id: record.id }] });
      }
      notify("Inscription réussie ! Frais non payés", { type: "info" });
      onSuccess?.(record);
    } catch (error: any) {
      notify(`Erreur : ${error.message}`, { type: "error" });
    }
  };

  if (isPast) {
    return <Chip icon={<EventBusy />} label="Rattrapage terminé" variant="outlined" size="small" sx={CHIP_PAST_SX} />;
  }

  if (isRegistered) {
    return (
      <Box display="flex" alignItems="center">
        <Chip icon={<EventAvailable />} label="Déjà inscrit" color="success" variant="outlined" size="small" sx={CHIP_REGISTERED_SX} />
      </Box>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={isLoading ? <CircularProgress size={12} /> : <HowToReg fontSize="small" />}
        onClick={() => setOpenConfirm(true)}
        disabled={isLoading}
        sx={ENROLL_BUTTON_SX}
      >
        {isLoading ? "Traitement..." : "S'inscrire"}
      </Button>

      <Confirm
        isOpen={openConfirm}
        title="Confirmation"
        content={`Voulez-vous vraiment vous inscrire au rattrapage de "${record.course?.name}" (${record.session?.title || "Session"}) ?`}
        onConfirm={enrollInRetakeExam}
        onClose={() => setOpenConfirm(false)}
      />
    </>
  );
};
