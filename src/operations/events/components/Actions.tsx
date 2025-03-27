import {useToggle} from "@/hooks";
import {ChipRadio} from "@/operations/common/components";
import {LETTER_ICON} from "@/operations/fees/components/letterIcon";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {useRole} from "@/security/hooks";
import {
  AttendanceStatus,
  EventParticipant,
  EventParticipantLetter,
} from "@haapi/typescript-client";
import {AttachFile, Visibility} from "@mui/icons-material";
import {IconButton, Stack, Tooltip} from "@mui/material";
import {FC, useState} from "react";
import {useGetIdentity, useRefresh} from "react-admin";
import {EventJustificateModal} from "./EventJustificateModal";

interface LetterActionProps {
  eventParticipantId: string;
  userId: string;
  letters: EventParticipantLetter[];
  username?: string;
}

interface IconButtonWithTooltipProps {
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const IconButtonWithTooltip = ({
  title,
  children,
  disabled,
  onClick,
}: IconButtonWithTooltipProps) => {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton disabled={disabled} onClick={onClick}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

interface StatusActionProps {
  participant: EventParticipant;
  localStatus: AttendanceStatus;
  changeStatus: (id: string, status: AttendanceStatus) => void;
}

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
          {value: "UNCHECKED", label: "Non défini", color: "info"},
        ]}
        onChange={(status) =>
          changeStatus(participant.id!, status as AttendanceStatus)
        }
      />
    </Stack>
  );
};

export const LetterActions = ({
  eventParticipantId,
  userId,
  letters,
  username,
}: LetterActionProps) => {
  const [show, _, toggle] = useToggle();
  const [viewerOpen, setViewerOpen] = useState(false);
  const refresh = useRefresh();
  const {data} = useGetIdentity();

  const disableAttach =
    (data?.id as string) !== userId ||
    letters.some(
      (letter) => letter.status === "RECEIVED" || letter.status === "PENDING"
    );

  const isNotOwner = (data?.id as string) !== userId;

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <IconButtonWithTooltip
          title="Enregister un justificatif"
          disabled={disableAttach}
          onClick={() => toggle()}
        >
          <AttachFile data-testid="attach-file" fontSize="small" />
        </IconButtonWithTooltip>
        <Icon letter={letters[0] || {}} />
        <IconButtonWithTooltip
          title="Voir le dernier justificatif"
          disabled={!letters[0]?.file_url || isNotOwner}
          onClick={() => setViewerOpen(true)}
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
      <EventJustificateModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        fileUrl={letters[0]?.file_url}
        userId={userId}
        username={username}
      />
    </>
  );
};
