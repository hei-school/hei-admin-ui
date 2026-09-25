import {CustomBreadcrumbs} from "@/operations/utils/CustomBreadcrumbs";
import {
  SmsContact,
  SmsContactGroupDetail,
} from "@haapi-b0fc7615/typescript-client";
import {
  Delete as DeleteIcon,
  GroupWork as SmsContactGroupIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {Home} from "lucide-react";
import {useMemo, useState} from "react";
import {useGetList, useGetOne} from "react-admin";
import {useNavigate, useParams} from "react-router-dom";
import {SMS_OWNER_ROLE_LABEL} from "./constants";
import {useOwnerAccount} from "./useOwnerAccount";
import {useSmsContactGroupMembers} from "./useSmsContactGroupMembers";

const contactLabel = (contact: SmsContact) =>
  [
    contact.name,
    contact.phoneNumber,
    contact.ownerRole ? SMS_OWNER_ROLE_LABEL[contact.ownerRole] : undefined,
  ]
    .filter(Boolean)
    .join(" — ");

export const SmsContactGroupShow = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<SmsContact | null>(
    null
  );

  const {
    data: groupData,
    isLoading: isGroupLoading,
    refetch,
  } = useGetOne("sms-contact-groups", {id: id ?? ""}, {enabled: !!id});
  const group = groupData as SmsContactGroupDetail | undefined;
  const {owner} = useOwnerAccount(group?.ownerId);

  const {data: contacts = []} = useGetList("sms-contacts", {
    pagination: {page: 1, perPage: 500},
  });

  const {addMember, removeMember, isMutating} = useSmsContactGroupMembers(
    id ?? "",
    refetch
  );

  const members = useMemo(() => group?.members ?? [], [group?.members]);
  const memberIds = useMemo(
    () => new Set(members.map((member) => member.id)),
    [members]
  );
  const availableContacts = useMemo(
    () => (contacts as SmsContact[]).filter((c) => !memberIds.has(c.id)),
    [contacts, memberIds]
  );

  const handleAdd = async () => {
    if (!selectedContact?.id) return;
    await addMember(selectedContact.id);
    setSelectedContact(null);
  };

  if (!id) return null;

  if (isGroupLoading) {
    return (
      <Box sx={{display: "flex", justifyContent: "center", py: 8}}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{maxWidth: 1400, mx: "auto", p: 3}}>
      <CustomBreadcrumbs
        sx={{mb: 2}}
        items={[
          {
            label: "Groupes de contacts",
            onClick: () => navigate("/sms-contact-groups"),
            icon: <Home size={16} />,
          },
          {
            label: group?.name ?? "Groupe",
            isActive: true,
            icon: <SmsContactGroupIcon fontSize="small" />,
          },
        ]}
      />

      <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mb: 3}}>
        <SmsContactGroupIcon />
        <Typography variant="h5">{group?.name}</Typography>
        <Chip
          size="small"
          variant="outlined"
          label={`${members.length} membre(s)`}
        />
        {owner && (
          <Chip
            size="small"
            variant="outlined"
            label={`Propriétaire : ${[owner.ref, owner.firstName].filter(Boolean).join(" — ")}`}
          />
        )}
      </Box>

      <Paper variant="outlined" sx={{p: 2, mb: 3}}>
        <Typography variant="subtitle2" sx={{mb: 1.5}}>
          Ajouter un contact au groupe
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Autocomplete
            fullWidth
            size="small"
            options={availableContacts}
            value={selectedContact}
            onChange={(_event, value) => setSelectedContact(value)}
            getOptionLabel={contactLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="Aucun contact disponible"
            renderInput={(params) => (
              <TextField {...params} label="Rechercher un contact" />
            )}
          />
          <Button
            variant="contained"
            disabled={!selectedContact || isMutating}
            onClick={handleAdd}
            data-testid="add-sms-contact-group-member"
          >
            Ajouter
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined">
        {members.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{p: 3, textAlign: "center"}}
          >
            Ce groupe n'a aucun membre pour le moment.
          </Typography>
        ) : (
          members.map((member) => (
            <Box
              key={member.id}
              sx={{
                "display": "flex",
                "alignItems": "center",
                "justifyContent": "space-between",
                "px": 2,
                "py": 1.5,
                "borderBottom": "1px solid",
                "borderColor": "divider",
                "&:last-of-type": {borderBottom: "none"},
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {member.name ?? "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {[
                    member.phoneNumber,
                    member.ownerRole
                      ? SMS_OWNER_ROLE_LABEL[member.ownerRole]
                      : undefined,
                  ]
                    .filter(Boolean)
                    .join(" — ")}
                </Typography>
              </Box>
              <Tooltip title="Retirer du groupe">
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={isMutating}
                    data-testid={`remove-sms-contact-group-member-${member.id}`}
                    onClick={() => member.id && removeMember(member.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};
