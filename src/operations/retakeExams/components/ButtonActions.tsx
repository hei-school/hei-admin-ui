import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";
import {RetakeExam, RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";
import {useEffect, useMemo, useState} from "react";
import {useCreate, useNotify, useRefresh} from "react-admin";
import {v4 as uuidv4} from "uuid";

function computeEnrollmentStatus(
  retakeExam: RetakeExam | null
): RetakeExamStatus | null {
  if (!retakeExam?.registration_date) return null;
  return retakeExam.status ?? null;
}

export function useButtonActions(
  retakeExam: RetakeExam | null,
  onSuccess?: (retakeExam: RetakeExam) => void
) {
  const userId = authProvider.getCachedWhoami()?.id;
  const notify = useNotify();
  const refresh = useRefresh();
  const [create] = useCreate();

  const [confirmOpen, setConfirmOpen] = useToggle(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useToggle(false);
  const [adminCancelConfirmOpen, setAdminCancelConfirmOpen] = useToggle(false);

  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<
    RetakeExamStatus | "LOADING" | null
  >(null);
  const [pendingStatus, setPendingStatus] = useState<RetakeExamStatus | null>(
    null
  );

  const examId = useMemo(() => retakeExam?.id ?? uuidv4(), [retakeExam?.id]);

  useEffect(() => {
    if (!retakeExam) return;
    const backendStatus = computeEnrollmentStatus(retakeExam);

    if (isLoading && pendingStatus && backendStatus === pendingStatus) {
      setIsLoading(false);
      setPendingStatus(null);
    } else if (!isLoading) {
      setLocalStatus(backendStatus);
    }
  }, [retakeExam, isLoading, pendingStatus]);

  const handleAction = async (
    status: RetakeExamStatus,
    successMsg: string,
    onClose: () => void
  ) => {
    if (!retakeExam || !userId) return;

    setIsLoading(true);
    setPendingStatus(status);
    setLocalStatus("LOADING");

    const payload = {
      id: examId,
      course_id: retakeExam.course?.id ?? "",
      session_id: retakeExam.session?.id ?? "",
      student_id: userId,
      status,
    };
    create(
      "retakeExams",
      {data: payload},
      {
        onSuccess: () => {
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
        onSettled: onClose,
      }
    );
  };

  const handleRegister = () =>
    handleAction("REGISTERED", "Inscription au rattrapage réussie.", () =>
      setConfirmOpen(false)
    );

  const handleRequestCancel = () =>
    handleAction("TO_CANCEL", "Demande d'annulation envoyée avec succès.", () =>
      setCancelConfirmOpen(false)
    );

  const handleValidateCancel = (canValidate: boolean) => {
    if (!canValidate) return;
    handleAction("CANCELED", "Rattrapage annulé avec succès.", () =>
      setAdminCancelConfirmOpen(false)
    );
  };

  return {
    status: isLoading ? "LOADING" : localStatus,
    isLoading,
    confirmOpen,
    cancelConfirmOpen,
    adminCancelConfirmOpen,
    setConfirmOpen,
    setCancelConfirmOpen,
    setAdminCancelConfirmOpen,
    handleRegister,
    handleRequestCancel,
    handleValidateCancel,
  };
}
