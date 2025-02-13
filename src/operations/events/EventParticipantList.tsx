import {PALETTE_COLORS} from "@/haTheme";
import {useNotify, useToggle} from "@/hooks";
import {
  DeleteWithConfirm,
  FileDownloader,
  Loader,
  Show,
} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import dataProvider from "@/providers/dataProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {
  AttendanceStatus,
  Event,
  EventParticipant,
} from "@haapi/typescript-client";
import {
  Add,
  Download,
  Event as EventIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {Box, Button, Stack, Typography} from "@mui/material";
import {useState} from "react";
import {
  Datagrid,
  FunctionField,
  SimpleShowLayout,
  TextField,
  useRefresh,
  useUpdate,
} from "react-admin";
import {useParams} from "react-router-dom";
import {
  AddGroupDialog,
  LetterActions,
  StatCard,
  StatusActionStatus,
} from "./components";
import {EventParticipantsFilter} from "./components/EventParticipantsFilter";

export function EventParticipantList() {
  const {eventId} = useParams();
  const {isAdmin, isManager, isOrganizer} = useRole();

  return (
    <Box>
      <Show title=" " id={eventId} resource="events">
        <SimpleShowLayout sx={{bgcolor: "white"}}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FunctionField
              title=" "
              render={(record: Event) => (
                <Typography fontWeight="bold" variant="h6">
                  {record.course?.code
                    ? `Salle ${record.title ?? ""}`
                    : (record.title ?? "")}
                </Typography>
              )}
            />
            {isAdmin() || isManager() || isOrganizer() ? (
              <DeleteWithConfirm
                resourceType="events"
                confirmContent="Voulez-vous vraiment supprimer la présence ?"
                confirmTitle="Confirmation de la suppression de présence"
                redirect="/events"
                buttonProps={{
                  variant: "contained",
                  type: "button",
                }}
              />
            ) : (
              <FunctionField
                title=" "
                render={(record: Event) => (
                  <Typography
                    fontWeight="bold"
                    variant="h6"
                    sx={{
                      backgroundColor: "#fcdfb5",
                      padding: "5px 1vw",
                      color: PALETTE_COLORS.primary,
                      borderRadius: "5px",
                    }}
                  >
                    {record?.course?.code ?? record.title}
                  </Typography>
                )}
              />
            )}
          </Box>
          <DateField label="De" source="begin_datetime" showTime />
          <DateField label="À" source="end_datetime" showTime />
          <FunctionField
            label="Groupes"
            render={(record: Event) => (
              <Typography
                fontSize={{
                  xs: "0.4rem",
                  sm: "0.6rem",
                  md: "0.8rem",
                  lg: "0.9rem",
                  xl: "1rem",
                }}
              >
                {record.groups?.map((group) => group.ref).join(", ")}
              </Typography>
            )}
          />
          <FunctionField
            label="Statistiques"
            render={(record: Event) => <StatCard stats={record.count ?? {}} />}
          />
        </SimpleShowLayout>
      </Show>
      <ListContent eventId={eventId!} />
    </Box>
  );
}

const ListContent = ({eventId}: {eventId: string}) => {
  const [participants, setParticipants] = useState([] as EventParticipant[]);
  const notify = useNotify();
  const [show, _, toggle] = useToggle();
  const [updateStatus, {isLoading: editStatus}] = useUpdate();
  const {isManager, isTeacher, isAdmin, isOrganizer} = useRole();
  const refresh = useRefresh();

  const [statusMap, setStatusMap] = useState(
    new Map<string, AttendanceStatus>()
  );

  const changeChipStatus = (
    eventParticipantId: string,
    status: AttendanceStatus
  ) => {
    setStatusMap((prev) => {
      let newMap = new Map(prev);
      return newMap.set(eventParticipantId, status);
    });
  };

  const changeStatus = async () => {
    const payload = participants.map((participant: EventParticipant) => ({
      id: participant.id,
      event_status:
        statusMap.get(participant.id!) ?? participant.event_status ?? "MISSING",
    }));
    await updateStatus(
      "event-participants",
      {
        data: payload,
        meta: {eventId},
      },
      {
        onSuccess: () => {
          notify("Enregistrer avec succès.", {type: "success"});
          refresh();
          setStatusMap(new Map());
        },
        onError: () => notify("Une erreur est survenu.", {type: "error"}),
      }
    );
  };

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("events-participants-export", {
      id: eventId,
    });

    return {data: file};
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
              <Box>
                <ButtonBase
                  icon={<Add />}
                  label="Ajout groupe"
                  onClick={() => toggle()}
                  children={<></>}
                />
                <FileDownloader
                  downloadFunction={downloadFile}
                  fileName="Listes des participants"
                  startIcon={<Download />}
                  sx={{
                    textTransform: "none",
                    color: "inherit",
                    opacity: "0.8",
                    padding: "0.5rem 1.1rem",
                    gap: "0.8rem",
                  }}
                  buttonText="Exporter"
                  successMessage="Exportation en cours..."
                  errorMessage="Erreur lors de l'exportation du fichier."
                  fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
              </Box>
            )}
            <EventParticipantsFilter />
          </Box>
        }
        datagridProps={{
          rowClick: false,
        }}
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
          disabled={editStatus || statusMap.size == 0}
        />
      )}
      <AddGroupDialog show={show} toggle={toggle} eventId={eventId} />
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
      startIcon={isLoading ? <Loader /> : <SaveIcon fontSize="small" />}
      variant={"contained"}
      onClick={() => onClick()}
      sx={{m: 2, maxWidth: 150, textTransform: "revert"}}
      disabled={disabled}
    >
      Enregistrer
    </Button>
  );
};
