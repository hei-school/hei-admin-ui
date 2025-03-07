import {
  Add,
  Download,
  Event as EventIcon,
  Save,
  Upload,
} from "@mui/icons-material";
import {Box, Stack} from "@mui/material";
import {useState} from "react";
import {
  Button,
  Datagrid,
  FunctionField,
  TextField,
  useRefresh,
  useUpdate,
} from "react-admin";

import {useNotify, useToggle} from "@/hooks";
import {FileDownloader, Loader} from "@/operations/common/components";
import dataProvider from "@/providers/dataProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {AttendanceStatus, EventParticipant} from "@haapi/typescript-client";

import {LetterActions, StatusActionStatus} from "./Actions";
import {AddGroupDialog} from "./AddGroup";
import {EventParticipantsFilter} from "./EventParticipantsFilter";
import {ImportStatusDialog} from "./ImportStatusDialog";

export const ListContent = ({eventId}: {eventId: string}) => {
  const [participants, setParticipants] = useState([] as EventParticipant[]);
  const notify = useNotify();
  const [showAddGroup, _, toggleAddGroup] = useToggle();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [updateStatus, {isLoading: editStatus}] = useUpdate();
  const {isManager, isTeacher, isAdmin, isOrganizer, isStudent} = useRole();
  const refresh = useRefresh();

  const [statusMap, setStatusMap] = useState(
    new Map<string, AttendanceStatus>()
  );

  const changeChipStatus = (
    eventParticipantId: string,
    status: AttendanceStatus
  ) => {
    setStatusMap((prev) => new Map(prev).set(eventParticipantId, status));
  };

  const changeStatus = async () => {
    const payload = participants.map((participant: EventParticipant) => ({
      id: participant.id,
      event_status:
        statusMap.get(participant.id!) ?? participant.event_status ?? "MISSING",
    }));
    await updateStatus(
      "event-participants",
      {data: payload, meta: {eventId}},
      {
        onSuccess: () => {
          notify("Enregistrer avec succès.", {type: "success"});
          refresh();
          setStatusMap(new Map());
        },
        onError: () => notify("Une erreur est survenue.", {type: "error"}),
      }
    );
  };

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("events-participants-export", {id: eventId});
    return {data: file};
  };

  const handleOpenImportDialog = () => {
    setShowImportDialog(true);
  };

  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
  };

  return (
    <Stack>
      <HaList
        resource="event-participants"
        mainSearch={{label: "Références étudiant(e)s", source: "studentRef"}}
        title="Listes des participants"
        icon={<EventIcon />}
        listProps={{
          title: "Présence",
          queryOptions: {
            meta: {eventId},
            onSuccess: (data: {data: EventParticipant[]}) => {
              setParticipants((participants) => participants.concat(data.data));
            },
          },
        }}
        hasDatagrid={false}
        actions={
          <Box>
            {(isManager() || isAdmin() || isOrganizer()) && (
              <ButtonBase
                icon={<Add />}
                label="Ajout groupe"
                onClick={() => toggleAddGroup()}
                children={<></>}
              />
            )}
            {!isStudent() && (
              <Box>
                <FileDownloader
                  downloadFunction={downloadFile}
                  fileName="Listes des participants"
                  startIcon={<Download />}
                  fullWidth
                  sx={{
                    textTransform: "none",
                    color: "inherit",
                    opacity: "0.8",
                    padding: "0.5rem 1.1rem",
                    gap: "0.8rem",
                    width: "10.11rem",
                  }}
                  buttonText="Exporter"
                  successMessage="Exportation en cours..."
                  errorMessage="Erreur lors de l'exportation du fichier."
                  fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
                <ButtonBase
                  icon={<Upload />}
                  onClick={handleOpenImportDialog}
                  label="Importer"
                  children={<></>}
                />
              </Box>
            )}
            <EventParticipantsFilter />
          </Box>
        }
        datagridProps={{rowClick: false}}
      >
        <Datagrid bulkActionButtons={false}>
          <TextField source="ref" label="Référence" />
          <TextField source="first_name" label="Prénom" />
          <TextField source="last_name" label="Nom" />
          <TextField source="group_name" label="Nom du groupe" />
          <FunctionField
            render={(record: EventParticipant) => (
              <StatusActionStatus
                participant={record}
                changeStatus={changeChipStatus}
                localStatus={statusMap.get(record.id!)!}
              />
            )}
            label="Status"
          />
          <FunctionField
            label="Justificatif"
            render={(record: EventParticipant) => {
              return (statusMap.get(record.id!) || record.event_status) ===
                "MISSING" ? (
                <LetterActions
                  userId={record.student_id!}
                  eventParticipantId={record.id!}
                  letters={record.letter || []}
                />
              ) : (
                <></>
              );
            }}
          />
        </Datagrid>
      </HaList>
      {(isManager() || isTeacher() || isAdmin()) && (
        <SaveButton
          onClick={changeStatus}
          isLoading={editStatus}
          disabled={editStatus || statusMap.size === 0}
        />
      )}
      <AddGroupDialog
        show={showAddGroup}
        toggle={toggleAddGroup}
        eventId={eventId}
      />
      <ImportStatusDialog
        open={showImportDialog}
        onClose={handleCloseImportDialog}
        eventId={eventId}
        participants={participants}
        onSuccess={refresh}
      />
    </Stack>
  );
};
interface ButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SaveButton = ({
  onClick,
  isLoading = false,
  disabled = false,
}: ButtonProps) => {
  return (
    <Button
      label="Enregistrer"
      startIcon={isLoading ? <Loader /> : <Save fontSize="small" />}
      variant={"contained"}
      onClick={() => onClick()}
      sx={{m: 2, maxWidth: 150, textTransform: "revert"}}
      disabled={disabled}
    />
  );
};
