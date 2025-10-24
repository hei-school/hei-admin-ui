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

export const ButtonActions = (
  retakeExam: RetakeExam | null,
  onSuccess?: (retakeExam: RetakeExam) => void
) => {
  const userId = authProvider.getCachedWhoami()?.id;
  const notify = useNotify();
  const [create] = useCreate();
  const {data: retakeExams = []} = useGetList("retakeExams", {
    filter: {status: RetakeExamStatus.TO_CANCEL},
  });

  const [isRegistering, setIsRegistering] = useToggle(false);
  const [isCanceling, setIsCanceling] = useToggle(false);
  const [isValidatingCancel, setIsValidatingCancel] = useToggle(false);

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
      status: RetakeExamStatus,
      successMsg: string,
      onClose: () => void
    ) => {
      if (!retakeExam) return;

      const matchingExam =
        retakeExams.find((exam) => exam.id === retakeExam.id) ?? retakeExam;
      const studentId = matchingExam.student_identifier?.id ?? userId;

      setIsLoading(true);
      setOptimisticStatus(status);

      const payload = {
        id: examId,
        course_id: retakeExam.course?.id ?? "",
        session_id: retakeExam.session?.id ?? "",
        student_id: studentId,
        status,
      };

      create(
        "retakeExams",
        {data: payload},
        {
          onSuccess: () => {
            notify(successMsg, {type: "success"});
            onSuccess?.({...retakeExam, status});
            onClose();
          },
          onError: () => {
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
    [create, retakeExam, examId, notify, onSuccess, userId, retakeExams]
  );
  const handleRegister = useCallback(() => {
    updateStatus("REGISTERED", "Inscription réussie.", () =>
      setIsRegistering(false)
    );
  }, [updateStatus, setIsRegistering]);
  const handleRequestCancel = useCallback(() => {
    updateStatus("TO_CANCEL", "Demande d'annulation envoyée.", () =>
      setIsCanceling(false)
    );
  }, [updateStatus, setIsCanceling]);
  const handleValidateCancel = useCallback(() => {
    updateStatus("CANCELED", "Annulation validée.", () =>
      setIsValidatingCancel(false)
    );
  }, [updateStatus, setIsValidatingCancel]);

  return {
    status: isLoading ? "LOADING" : localStatus,
    optimisticStatus,
    isLoading,

    isRegistering,
    isCanceling,
    isValidatingCancel,

    setIsRegistering,
    setIsCanceling,
    setIsValidatingCancel,

    handleRegister,
    handleRequestCancel,
    handleValidateCancel,
  };
};
