import {
  SmsContact,
  SmsContactOwnerRole,
} from "@haapi-b0fc7615/typescript-client";
import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
} from "@mui/material";
import {SMS_OWNER_ROLE_LABEL} from "./constants";

const DEFAULT_ROLE_ORDER: SmsContactOwnerRole[] = [
  SmsContactOwnerRole.ADMIN,
  SmsContactOwnerRole.STUDENT,
  SmsContactOwnerRole.TEACHER,
  SmsContactOwnerRole.MANAGER,
  SmsContactOwnerRole.MONITOR,
  SmsContactOwnerRole.STAFF_MEMBER,
  SmsContactOwnerRole.ORGANIZER,
];

const getOrderedRoles = (
  search: string
): {roles: SmsContactOwnerRole[]; linkedRole?: SmsContactOwnerRole} => {
  const trimmed = search.trim().toUpperCase();
  const [primaryRole, linkedRole] = trimmed.startsWith("STD")
    ? [SmsContactOwnerRole.STUDENT, SmsContactOwnerRole.MONITOR]
    : trimmed.startsWith("MTR")
      ? [SmsContactOwnerRole.MONITOR, SmsContactOwnerRole.STUDENT]
      : [undefined, undefined];
  if (!primaryRole || !linkedRole) return {roles: DEFAULT_ROLE_ORDER};
  return {
    roles: [
      primaryRole,
      linkedRole,
      ...DEFAULT_ROLE_ORDER.filter(
        (role) => role !== primaryRole && role !== linkedRole
      ),
    ],
    linkedRole,
  };
};

const roleSectionLabel = (role: SmsContactOwnerRole, linkedRole?: string) =>
  `${SMS_OWNER_ROLE_LABEL[role]}${role === linkedRole ? " lié" : ""}`;

const ContactResultColumn = ({
  label,
  contacts,
  isSelected,
  onToggle,
  getLabel,
  testIdPrefix,
}: {
  label: string;
  contacts: SmsContact[];
  isSelected: (id: string) => boolean;
  onToggle: (contact: SmsContact) => void;
  getLabel: (contact: SmsContact) => string;
  testIdPrefix: string;
}) => (
  <Box
    sx={{
      "flex": "1 1 220px",
      "minWidth": 220,
      "borderRight": "1px solid",
      "borderColor": "divider",
      "&:last-of-type": {borderRight: "none"},
    }}
  >
    <List
      dense
      disablePadding
      subheader={
        <ListSubheader disableSticky sx={{lineHeight: "32px"}}>
          {label} ({contacts.length})
        </ListSubheader>
      }
    >
      {contacts.map((contact) => (
        <ListItemButton
          key={contact.id}
          dense
          onClick={() => onToggle(contact)}
          data-testid={`${testIdPrefix}-${contact.id}`}
        >
          <ListItemIcon sx={{minWidth: 36}}>
            <Checkbox
              edge="start"
              size="small"
              checked={!!contact.id && isSelected(contact.id)}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText
            primary={getLabel(contact)}
            primaryTypographyProps={{sx: {wordBreak: "break-word"}}}
          />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

interface SmsContactSearchResultsProps {
  contacts: SmsContact[];
  searchInput: string;
  isSelected: (id: string) => boolean;
  onToggle: (contact: SmsContact) => void;
  getLabel: (contact: SmsContact) => string;
  emptyMessage: string;
  testIdPrefix?: string;
}

export const SmsContactSearchResults = ({
  contacts,
  searchInput,
  isSelected,
  onToggle,
  getLabel,
  emptyMessage,
  testIdPrefix = "toggle-sms-contact",
}: SmsContactSearchResultsProps) => {
  const {roles: orderedRoles, linkedRole} = getOrderedRoles(searchInput);
  const contactsByRole = new Map<SmsContactOwnerRole, SmsContact[]>();
  const contactsWithoutRole: SmsContact[] = [];
  contacts.forEach((contact) => {
    if (!contact.ownerRole) {
      contactsWithoutRole.push(contact);
      return;
    }
    contactsByRole.set(contact.ownerRole, [
      ...(contactsByRole.get(contact.ownerRole) ?? []),
      contact,
    ]);
  });
  const roleColumns = orderedRoles
    .map((role) => ({
      key: role as string,
      label: roleSectionLabel(role, linkedRole),
      contacts: contactsByRole.get(role) ?? [],
    }))
    .filter((column) => column.contacts.length > 0);
  if (contactsWithoutRole.length > 0) {
    roleColumns.push({
      key: "autre",
      label: "Autre",
      contacts: contactsWithoutRole,
    });
  }

  if (contacts.length === 0) {
    return (
      <List dense disablePadding>
        <ListItem>
          <ListItemText primary={emptyMessage} />
        </ListItem>
      </List>
    );
  }

  return (
    <Stack direction="row" flexWrap="wrap">
      {roleColumns.map(({key, label, contacts: columnContacts}) => (
        <ContactResultColumn
          key={key}
          label={label}
          contacts={columnContacts}
          isSelected={isSelected}
          onToggle={onToggle}
          getLabel={getLabel}
          testIdPrefix={testIdPrefix}
        />
      ))}
    </Stack>
  );
};
