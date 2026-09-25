import {DeleteWithConfirm} from "@/operations/common/components";
import {HaList} from "@/ui/haList/HaList";
import {SmsContactGroup} from "@haapi-b0fc7615/typescript-client";
import {
  Add,
  Group as MembersIcon,
  GroupWork as SmsContactGroupIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {FunctionField, Identifier, RaRecord} from "react-admin";
import {useNavigate} from "react-router-dom";
import {SmsContactGroupDialog} from "./SmsContactGroupDialog";
import {useOwnerAccount} from "./useOwnerAccount";

const OwnerCell = ({ownerId}: {ownerId?: string}) => {
  const {owner, isLoading} = useOwnerAccount(ownerId);

  if (isLoading) {
    return <Skeleton variant="text" width={100} />;
  }

  if (!owner) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Typography variant="body2">
      {[owner.ref, owner.firstName].filter(Boolean).join(" — ")}
    </Typography>
  );
};

export const SmsContactGroupList = () => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const goToGroup = (id?: string) =>
    id && navigate(`/sms-contact-groups/${id}`);

  return (
    <Box>
      <HaList
        icon={<SmsContactGroupIcon />}
        title="Groupes de contacts SMS"
        resource="sms-contact-groups"
        actions={
          <Button
            startIcon={<Add />}
            onClick={() => setIsCreateOpen(true)}
            data-testid="create-sms-contact-group"
          >
            Créer un groupe
          </Button>
        }
        datagridProps={{
          rowClick: (_id: Identifier, _resource: string, record: RaRecord) => {
            goToGroup((record as SmsContactGroup).id);
            return false;
          },
        }}
        listProps={{title: "Groupes de contacts SMS"}}
      >
        <FunctionField
          label="Nom"
          render={(record: SmsContactGroup) => (
            <Stack direction="row" spacing={1} alignItems="center">
              <SmsContactGroupIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={600}>
                {record.name}
              </Typography>
            </Stack>
          )}
        />
        <FunctionField
          label="Membres"
          render={(record: SmsContactGroup) => (
            <Chip
              size="small"
              variant="outlined"
              color={record.memberCount ? "primary" : "default"}
              icon={<MembersIcon />}
              label={record.memberCount ?? 0}
            />
          )}
        />
        <FunctionField
          label="Propriétaire"
          render={(record: SmsContactGroup) => (
            <OwnerCell ownerId={record.ownerId} />
          )}
        />
        <FunctionField
          label="Actions"
          render={(record: SmsContactGroup) => (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{width: "100%"}}
              onClick={(event) => event.stopPropagation()}
            >
              <Tooltip title="Voir les membres">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => goToGroup(record.id)}
                  data-testid={`view-sms-contact-group-${record.id}`}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <DeleteWithConfirm
                resourceType="sms-contact-groups"
                id={record.id}
                redirect=""
                confirmTitle="Supprimer ce groupe de contacts ?"
                confirmContent="Cette action ne supprime pas les contacts, seulement le groupe."
                buttonProps={{
                  sx: {minWidth: 0, p: "4px"},
                }}
              />
            </Stack>
          )}
        />
      </HaList>
      {isCreateOpen && (
        <SmsContactGroupDialog onClose={() => setIsCreateOpen(false)} />
      )}
    </Box>
  );
};
