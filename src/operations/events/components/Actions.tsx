import {Visibility, AttachFile} from "@mui/icons-material";
import {Stack, Tooltip, IconButton} from "@mui/material";
import {ChipRadio} from "@/operations/common/components";
import {
  AttendanceStatus,
  EventParticipant,
  EventParticipantLetter,
} from "@haapi/typescript-client";
import {FC} from "react";
import {useRole} from "@/security/hooks";
import {IconButtonWithTooltip} from "@/operations/utils";
import {useToggle} from "@/hooks";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {useGetIdentity, useRefresh} from "react-admin";
import {LETTER_ICON} from "@/operations/fees/components/letterIcon";

interface LetterActionProps {
  eventParticipantId: string;
  userId: string;
  letters: EventParticipantLetter[];
}

export const LetterActions = ({
  eventParticipantId,
  userId,
  letters,
}: LetterActionProps) => {
  const [show, _, toggle] = useToggle();
  const {isManager, isAdmin} = useRole();
  const refresh = useRefresh();
  const {data} = useGetIdentity();

  const disableAttach =
    (data?.id as string) !== userId ||
    letters.some(
      (letter) => letter.status === "RECEIVED" || letter.status === "PENDING"
    );
  const disableView =
    (!(isManager() || isAdmin()) && (data?.id as string) !== userId) ||
    !letters[0];

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <IconButtonWithTooltip
        title="Enregister un justificatif"
        disabled={disableAttach}
      >
        <AttachFile
          data-testid="attach-file"
          onClick={() => toggle()}
          fontSize="small"
        />
      </IconButtonWithTooltip>
      <Icon letter={letters[0] || {}} />
      <IconButtonWithTooltip
        title="Voir le dernier justificatif"
        disabled={disableView}
      >
        <Visibility data-testid="view-file" fontSize="small" />
      </IconButtonWithTooltip>
      <CreateLettersDialog
        isOpen={show}
        onClose={() => {
          toggle();
          refresh();
        }}
        userId={userId}
        eventParticipantId={eventParticipantId}
        title="Justificatif d'absence"
      />
    </Stack>
  );
};

export const LETTER_STATUS_LABEL = {
  RECEIVED: "Justifié avec succès",
  REJECTED: "Justificatif non accepté",
  PENDING: "Vérification en cours",
};

const Icon = ({letter}: {letter: EventParticipantLetter}) => {
  return (
    <Tooltip
      title={LETTER_STATUS_LABEL[letter.status!] || ""}
      data-testid={`letterTypeIcon-${letter.ref}`}
    >
      <IconButton>{LETTER_ICON[letter?.status!] || <></>}</IconButton>
    </Tooltip>
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
  const {isManager, isTeacher, isAdmin} = useRole();

  return (
    <Stack direction="row" gap={1}>
      <ChipRadio
        label=" "
        defaultSelected={localStatus || participant.event_status!}
        enable={isManager() || isTeacher() || isAdmin()}
        data-testid={`eventparticipant-${participant.id}-status`}
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
