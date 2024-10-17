import {CheckCircle, AttachFile} from "@mui/icons-material";
import {Stack} from "@mui/material";
import {ChipRadio} from "@/operations/common/components";
import {AttendanceStatus, EventParticipant} from "@haapi/typescript-client";
import {FC} from "react";
import {useRole} from "@/security/hooks";
import {IconButtonWithTooltip} from "@/operations/utils";

export const LetterActons = () => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <IconButtonWithTooltip
        title="Enregister un justificatif"
        disabled={false}
      >
        <AttachFile fontSize="small" />
      </IconButtonWithTooltip>
      <CheckCircle color="success" />
    </Stack>
  );
};

interface StatusActionProps {
  participant: EventParticipant;
  localStatus: AttendanceStatus;
  changeStatus: (id: string, status: AttendanceStatus) => void;
}

export const StatusActionStatus: FC<StatusActionProps> = ({
  participant,
  changeStatus,
  localStatus,
}) => {
  const {isManager, isTeacher} = useRole();

  return (
    <Stack direction="row" gap={1}>
      <ChipRadio
        label=" "
        defaultSelected={localStatus || participant.event_status!}
        enable={isManager() || isTeacher()}
        choices={[
          {value: "PRESENT", label: "Présent", color: "success"},
          {value: "MISSING", label: "Absent", color: "error"},
          {value: "LATE", label: "En retard", color: "info"},
        ]}
        onChange={(status) =>
          changeStatus(participant.id!, status as AttendanceStatus)
        }
      />
    </Stack>
  );
};
