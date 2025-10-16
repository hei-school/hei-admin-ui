import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";
import {RetakeExam, RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";
import {useEffect, useState} from "react";
import {useCreate, useNotify, useRefresh} from "react-admin";

export function computeEnrollmentStatus(
  retakeExam: RetakeExam
): RetakeExamStatus | null {
  if (!retakeExam || !retakeExam.registration_date) return null;
  if (retakeExam.status === "TO_CANCEL") return "TO_CANCEL";
  if (retakeExam.status === "CANCELED") return "CANCELED";
  return "REGISTERED";
}

export const ButtonActions = (
  retakeExam: RetakeExam,
  onSuccess?: (retakeExam: RetakeExam) => void
) => {
  const userId = authProvider.getCachedWhoami()?.id;
  const notify = useNotify();
  const refresh = useRefresh();
  const [create] = useCreate();

  const [confirmOpen, setConfirmOpen] = useToggle(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useToggle(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<
    RetakeExamStatus | "LOADING" | null
  >(null);

  const [pendingStatus, setPendingStatus] = useState<RetakeExamStatus | null>(
    null
  );
  useEffect(() => {
    if (!retakeExam) return;

    const currentBackendStatus = computeEnrollmentStatus(retakeExam);

    if (isLoading && pendingStatus && currentBackendStatus === pendingStatus) {
      setIsLoading(false);
      setPendingStatus(null);
    }
    if (!isLoading) {
      setLocalStatus(currentBackendStatus);
    }
  }, [retakeExam, isLoading, pendingStatus]);

  const handleSave = async (
    newStatus: RetakeExamStatus,
    successMsg: string
  ) => {
    if (!retakeExam || !userId) return;

    setIsLoading(true);
    setPendingStatus(newStatus);
    setLocalStatus("LOADING");

    const payload = {
      id: retakeExam.id,
      course_id: retakeExam.course?.id ?? "",
      session_id: retakeExam.session?.id ?? "",
      student_id: userId,
      status: newStatus,
    };

    create(
      "retakeExams",
      {data: payload},
      {
        onSuccess: async () => {
          notify(successMsg, {type: "success"});
          onSuccess?.(retakeExam);
          refresh();
        },
        onError: () => {
          notify("Une erreur est survenue. Merci de réessayer plus tard.", {
            type: "error",
          });
          setIsLoading(false);
          setPendingStatus(null);
          setLocalStatus(computeEnrollmentStatus(retakeExam));
        },
        onSettled: () => {
          setConfirmOpen(false);
          setCancelConfirmOpen(false);
        },
      }
    );
  };

  return {
    status: isLoading ? "LOADING" : localStatus,
    isLoading,
    confirmOpen,
    cancelConfirmOpen,
    setConfirmOpen,
    setCancelConfirmOpen,
    handleSave,
  };
};
