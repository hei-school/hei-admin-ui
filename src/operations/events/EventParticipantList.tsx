import {useParams} from "react-router-dom";
import {
  Datagrid,
  FunctionField,
  SimpleShowLayout,
  TextField,
  useUpdate,
} from "react-admin";
import {Event as EventIcon, Add, Save as SaveIcon} from "@mui/icons-material";
import {Box, Stack, Typography, Button} from "@mui/material";
import {HaList} from "@/ui/haList";
import {ButtonBase} from "@/ui/haToolbar";
import {Loader, Show} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {
  AttendanceStatus,
  Event,
  EventParticipant,
} from "@haapi/typescript-client";
import {useState} from "react";
import {useNotify, useToggle} from "@/hooks";
import {AddGroupDialog, LetterActons, StatusActionStatus} from "./components";

export function EventParticipantList() {
  const {eventId} = useParams();

  return (
    <Box>
      <Show title=" " id={eventId} resource="events">
        <SimpleShowLayout sx={{bgcolor: "white"}}>
          <FunctionField
            title=" "
            render={(record: Event) => (
              <Typography fontWeight="bold" variant="h6">
                {record.title || ""}
              </Typography>
            )}
          />
          <DateField label="De" source="begin_datetime" showTime />
          <DateField label="À" source="end_datetime" showTime />
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
        statusMap.get(participant.id!) || participant.event_status || "MISSING",
    }));
    await updateStatus(
      "event-participants",
      {
        data: payload,
        meta: {eventId},
      },
      {
        onSuccess: () => notify("Enregistrer avec succès.", {type: "success"}),
        onError: () => notify("Une erreur est survenu.", {type: "error"}),
      }
    );
  };

  return (
    <Stack>
      <HaList
        resource="event-participants"
        title="Listes des participants"
        icon={<EventIcon />}
        listProps={{
          title: "Présence",
          queryOptions: {
            meta: {eventId},
            onSuccess: (data: {data: EventParticipant[]}) => {
              setParticipants(data.data);
            },
          },
        }}
        hasDatagrid={false}
        actions={
          <ButtonBase
            icon={<Add />}
            label="Ajout groupe"
            onClick={() => toggle()}
            children={<></>}
          />
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
                <LetterActons />
              ) : (
                <></>
              );
            }}
          />
        </Datagrid>
      </HaList>
      <SaveButton
        onClick={changeStatus}
        isLoading={editStatus}
        disabled={editStatus}
      />
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
      variant={"contained"}
      onClick={() => onClick()}
      sx={{m: 2, maxWidth: 300, textTransform: "revert"}}
      disabled={disabled}
    >
      {isLoading ? <Loader /> : <SaveIcon fontSize="small" />}
      Enregister
    </Button>
  );
};
