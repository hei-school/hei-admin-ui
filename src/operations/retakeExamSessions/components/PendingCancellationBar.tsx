import {AlertBar} from "@/ui/components/AlertBar";
import {RetakeExamStatus} from "@haapi-3d601c85/typescript-client";
import {AlertCircle} from "lucide-react";

export const PendingCancellationBar = ({onClick}: {onClick?: () => void}) => (
  <AlertBar
    resource="retakeExams"
    filter={{status: RetakeExamStatus.TO_CANCEL}}
    title="Demandes d'annulation de rattrapage en attente"
    icon={AlertCircle}
    navigateTo="/retake-exams/cancellation"
    onClick={onClick}
  />
);
