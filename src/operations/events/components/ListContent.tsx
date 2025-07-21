import {useNotify, useToggle} from "@/hooks";
import {FileDownloader, Loader} from "@/operations/common/components";
import {FloatingActionButton} from "@/operations/common/components/FloatingActionButton";
import dataProvider from "@/providers/dataProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {AttendanceStatus, EventParticipant} from "@haapi/typescript-client";
import {
  Add,
  CheckCircleOutline,
  Download,
  Event as EventIcon,
  Upload,
} from "@mui/icons-material";
import {Box, Stack} from "@mui/material";
import {useCallback, useState} from "react";
import {
  Datagrid,
  FunctionField,
  TextField,
  useListContext,
  useRefresh,
  useUpdate,
} from "react-admin";
import {LetterActions, StatusActionStatus} from "./Actions";
import {AddGroupDialog} from "./AddGroup";
import {EventParticipantsFilter} from "./EventParticipantsFilter";
import {ImportStatusDialog} from "./ImportStatusDialog";

export const ListContent = ({eventId}: {eventId: string}) => {
  const [participants, setParticipants] = useState<
    Map<string, EventParticipant>
  >(new Map());
  const [statusMap, setStatusMap] = useState<Map<string, AttendanceStatus>>(
    new Map()
  );
  const notify = useNotify();
  const [showAddGroup, _, toggleAddGroup] = useToggle();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [updateStatus, {isLoading: editStatus}] = useUpdate();
  const {isManager, isTeacher, isAdmin, isOrganizer, isStudent} = useRole();
  const refresh = useRefresh();
  const {page, perPage, total} = useListContext();
  const updateParticipants = useCallback(
    (newParticipants: EventParticipant[]) => {
      const expectedCount =
        page === Math.ceil(total / perPage)
          ? total % perPage || perPage
          : perPage;

      if (newParticipants.length < expectedCount) {
        notify("Données incomplètes reçues. Vérifiez votre connexion.", {
          type: "warning",
        });
        return;
      }

      setParticipants((prev) => {
        const updatedMap = new Map(prev);
        newParticipants.forEach((participant) => {
          if (participant.id) {
            updatedMap.set(participant.id, participant);
          }
        });
        return updatedMap;
      });
    },
    [page, perPage, total, notify]
  );

  const changeChipStatus = useCallback(
    (eventParticipantId: string, status: AttendanceStatus) => {
      if (eventParticipantId) {
        setStatusMap((prev) => new Map(prev).set(eventParticipantId, status));
      }
    },
    []
  );

  const changeStatus = useCallback(async () => {
    const payload = Array.from(participants.values())
      .filter((p): p is EventParticipant & {id: string} => !!p.id)
      .map((participant) => ({
        id: participant.id,
        event_status:
          statusMap.get(participant.id) ??
          participant.event_status ??
          "MISSING",
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
  }, [participants, statusMap, updateStatus, eventId, notify, refresh]);

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("events-participants-export", {id: eventId});
    return {data: file};
  };

  const handleOpenImportDialog = () => setShowImportDialog(true);
  const handleCloseImportDialog = () => setShowImportDialog(false);

  return (
    <Stack>
      <HaList
        resource="event-participants"
        mainSearch={{label: "Références étudiant(e)s", source: "studentRef"}}
        title="Listes des participants"
        icon={<EventIcon />}
        listProps={{
          perPage: 50,
          title: "Présence",
          queryOptions: {
            meta: {eventId},
            onSuccess: (data: {data: EventParticipant[]; total: number}) => {
              updateParticipants(data.data);
            },
            onError: () => {
              notify(
                "Erreur de chargement des données. Vérifiez votre connexion.",
                {
                  type: "error",
                }
              );
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
                localStatus={
                  statusMap.get(record.id!) ??
                  record.event_status ??
                  "UNCHECKED"
                }
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
                  username={record.first_name}
                  eventParticipantId={record.id!}
                  letters={record.letter || []}
                />
              ) : null;
            }}
          />
        </Datagrid>
      </HaList>
      {(isManager() || isTeacher() || isAdmin()) && (
        <FloatingActionButton
          onClick={changeStatus}
          isLoading={editStatus}
          disabled={editStatus || statusMap.size === 0}
          count={statusMap.size}
          countLabel={(count) =>
            count === 1 ? "item sélectionné" : "items sélectionnés"
          }
          actionIcon={
            editStatus ? (
              <Loader />
            ) : (
              <CheckCircleOutline sx={{fontSize: "20px"}} />
            )
          }
          actionLabel="Sauvegarder"
          loadingLabel="Enregistrement..."
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
        participants={Array.from(participants.values())}
        onSuccess={refresh}
      />
    </Stack>
  );
};
