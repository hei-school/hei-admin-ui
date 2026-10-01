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
import {Confirm, useGetOne} from "react-admin";
import {useNavigate, useParams} from "react-router-dom";
import {SMS_OWNER_ROLE_LABEL} from "./constants";
import {SmsContactSearchResults} from "./SmsContactSearchResults";
import {useOwnerAccount} from "./useOwnerAccount";
import {useSmsContactGroupMembers} from "./useSmsContactGroupMembers";
import {MIN_SEARCH_LENGTH, useSmsContactSearch} from "./useSmsContactSearch";

const contactLabel = (contact: SmsContact) =>
  [contact.name, contact.phoneNumber].filter(Boolean).join(" — ");

export const SmsContactGroupShow = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const [selectedContacts, setSelectedContacts] = useState<SmsContact[]>([]);
  const [memberToRemove, setMemberToRemove] = useState<SmsContact | null>(null);
  const {
    searchInput,
    setSearchInput,
    results: searchResults,
    isSearching,
    canSearch,
  } = useSmsContactSearch();

  const {
    data: groupData,
    isLoading: isGroupLoading,
    refetch,
  } = useGetOne("sms-contact-groups", {id: id ?? ""}, {enabled: !!id});
  const group = groupData as SmsContactGroupDetail | undefined;
  const {owner} = useOwnerAccount(group?.ownerId);

  const {addMembers, removeMember, isMutating} = useSmsContactGroupMembers(
    id ?? "",
    refetch
  );

  const members = useMemo(() => group?.members ?? [], [group?.members]);
  const memberIds = useMemo(
    () => new Set(members.map((member) => member.id)),
    [members]
  );
  const selectedIds = useMemo(
    () => new Set(selectedContacts.map((contact) => contact.id)),
    [selectedContacts]
  );
  const availableContacts = useMemo(
    () => searchResults.filter((c) => !memberIds.has(c.id)),
    [searchResults, memberIds]
  );

  const toggleContact = (contact: SmsContact) => {
    setSelectedContacts((prev) =>
      prev.some((selected) => selected.id === contact.id)
        ? prev.filter((selected) => selected.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleAddSelected = async () => {
    await addMembers(
      selectedContacts
        .map((contact) => contact.id)
        .filter((contactId): contactId is string => !!contactId)
    );
    setSelectedContacts([]);
    setSearchInput("");
  };

  const handleConfirmRemove = async () => {
    if (memberToRemove?.id) {
      await removeMember(memberToRemove.id);
    }
    setMemberToRemove(null);
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
          Ajouter des contacts au groupe
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Rechercher un contact (nom ou numéro)"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          inputProps={{"data-testid": "sms-contact-search-input"}}
          sx={{mb: 1.5}}
        />

        {selectedContacts.length > 0 && (
          <Box sx={{mb: 1.5}}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{display: "block", mb: 0.5}}
            >
              Contacts sélectionnés
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              {selectedContacts.map((contact) => (
                <Chip
                  key={contact.id}
                  size="small"
                  label={contactLabel(contact)}
                  onDelete={() => toggleContact(contact)}
                />
              ))}
            </Stack>
          </Box>
        )}

        {searchInput.length > 0 && (
          <Box
            sx={{
              mb: 1.5,
              maxHeight: 320,
              overflow: "auto",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <SmsContactSearchResults
              contacts={availableContacts}
              searchInput={searchInput}
              isSelected={(id) => selectedIds.has(id)}
              onToggle={toggleContact}
              getLabel={contactLabel}
              emptyMessage={
                !canSearch
                  ? `Tapez au moins ${MIN_SEARCH_LENGTH} caractères`
                  : isSearching
                    ? "Recherche…"
                    : "Aucun contact trouvé"
              }
            />
          </Box>
        )}

        <Button
          variant="contained"
          disabled={selectedContacts.length === 0 || isMutating}
          onClick={handleAddSelected}
          data-testid="add-sms-contact-group-members"
        >
          Ajouter ({selectedContacts.length})
        </Button>
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
                    onClick={() => setMemberToRemove(member)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))
        )}
      </Paper>

      <Confirm
        isOpen={!!memberToRemove}
        title="Retirer ce contact du groupe ?"
        content={`Voulez-vous vraiment retirer ${memberToRemove?.name ?? "ce contact"} de ce groupe ?`}
        confirm="Retirer"
        confirmColor="warning"
        ConfirmIcon={DeleteIcon}
        onConfirm={handleConfirmRemove}
        onClose={() => setMemberToRemove(null)}
      />
    </Box>
  );
};
