import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";
import {RetakeExam, RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useCreate, useGetList, useNotify} from "react-admin";

const computeEnrollmentStatus = (
  retakeExam: RetakeExam | null
): RetakeExamStatus | null => {
  if (!retakeExam?.registration_date) return null;
  return retakeExam.status ?? null;
};

export const useButtonActions = (
  retakeExam: RetakeExam | null,
  onSuccess?: (retakeExam: RetakeExam) => void
) => {
  const userId = authProvider.getCachedWhoami()?.id;
  const notify = useNotify();
  const [create] = useCreate();
  const {data: retakeExams = [], refetch} = useGetList("retakeExams", {
    filter: {status: RetakeExamStatus.TO_CANCEL},
  });

  const [isRegistering, setIsRegistering] = useToggle(false);
  const [isCanceling, setIsCanceling] = useToggle(false);
  const [isValidatingCancel, setIsValidatingCancel] = useToggle(false);
  const [isRejectingCancel, setIsRejectingCancel] = useToggle(false);

  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<RetakeExamStatus | null>(null);
  const [optimisticStatus, setOptimisticStatus] =
    useState<RetakeExamStatus | null>(null);

  const examId = useMemo(
    () => retakeExam?.id ?? `temp-${retakeExam?.course?.id}`,
    [retakeExam?.id, retakeExam?.course?.id]
  );

  useEffect(() => {
    setIsLoading(false);
    setOptimisticStatus(null);
  }, [examId]);

  useEffect(() => {
    if (!retakeExam) return;
    const backendStatus = computeEnrollmentStatus(retakeExam);

    if (!isLoading) {
      setLocalStatus(backendStatus);
    }
    if (isLoading && backendStatus === optimisticStatus) {
      setIsLoading(false);
      setOptimisticStatus(null);
    }
  }, [retakeExam, isLoading, optimisticStatus]);

  const updateStatus = useCallback(
    async (
      targetStatus: RetakeExamStatus,
      successMsg: string,
      onClose: () => void,
      reason?: string
    ) => {
      if (!retakeExam) return;

      const matchingExam =
        retakeExams.find((exam) => exam.id === retakeExam.id) ?? retakeExam;
      const studentId = matchingExam.student_identifier?.id ?? userId;
      const currentStatus = localStatus;

      setIsLoading(true);
      setOptimisticStatus(targetStatus);

      const isInitialRegistration = !retakeExam.id || !currentStatus;

      const payload = isInitialRegistration
        ? {
            id: examId,
            course_id: retakeExam.course?.id ?? "",
            session_id: retakeExam.session?.id ?? "",
            student_id: studentId,
            status: targetStatus,
          }
        : {
            id: retakeExam.id,
            currentStatus: currentStatus,
            status: targetStatus,
            ...(reason && {reason}),
          };

      const resourceId = isInitialRegistration
        ? (retakeExam.session?.id ?? "")
        : currentStatus;

      create(
        "retakeExams",
        {
          data: payload,
          meta: {resourceId},
        },
        {
          onSuccess: () => {
            notify(successMsg, {type: "success"});
            onSuccess?.({...retakeExam, status: targetStatus});
            refetch();
            onClose();
          },
          onError: (error) => {
            console.error("Error updating retake exam:", error);
            notify("Une erreur est survenue. Merci de réessayer.", {
              type: "error",
            });
            setIsLoading(false);
            setOptimisticStatus(null);
            onClose();
          },
        }
      );
    },
    [
      create,
      retakeExam,
      examId,
      notify,
      onSuccess,
      userId,
      retakeExams,
      localStatus,
      refetch,
    ]
  );
  const handleRegister = useCallback(() => {
    updateStatus(RetakeExamStatus.REGISTERED, "Inscription réussie.", () =>
      setIsRegistering(false)
    );
  }, [updateStatus, setIsRegistering]);

  const handleRequestCancel = useCallback(
    (reason: string) => {
      updateStatus(
        RetakeExamStatus.TO_CANCEL,
        "Demande d'annulation envoyée.",
        () => setIsCanceling(false),
        reason
      );
    },
    [updateStatus, setIsCanceling]
  );

  const handleValidateCancel = useCallback(() => {
    updateStatus(RetakeExamStatus.CANCELED, "Annulation validée.", () =>
      setIsValidatingCancel(false)
    );
  }, [updateStatus, setIsValidatingCancel]);

  const handleRejectCancel = useCallback(
    (reason: string) => {
      updateStatus(
        RetakeExamStatus.REGISTERED,
        "Demande d'annulation rejetée.",
        () => setIsRejectingCancel(false),
        reason
      );
    },
    [updateStatus, setIsRejectingCancel]
  );

  return {
    status: isLoading ? "LOADING" : localStatus,
    optimisticStatus,
    isLoading,

    isRegistering,
    isCanceling,
    isValidatingCancel,
    isRejectingCancel,

    setIsRegistering,
    setIsCanceling,
    setIsValidatingCancel,
    setIsRejectingCancel,

    handleRegister,
    handleRequestCancel,
    handleValidateCancel,
    handleRejectCancel,
  };
};
