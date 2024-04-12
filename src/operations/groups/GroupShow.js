import {Typography, Box} from "@mui/material";
import {
  EditButton,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
} from "react-admin";
import {
  Fingerprint as ReferenceIcon,
  PermIdentity as NameIcon,
  CalendarMonth as CreationDateIcon,
} from "@mui/icons-material";
import {DateField, FieldLabel} from "../common/components/fields";
import {useRole} from "../../security/hooks";
import {EMPTY_TEXT} from "../../ui/constants";
import {COMMON_FIELD_ATTRIBUTES} from "../../ui/constants/common_styles";
import GroupStudentList from "./components/GroupStudentList";

const FIELD_PROPS = {
  component: "pre",
  emptyText: EMPTY_TEXT,
  ...COMMON_FIELD_ATTRIBUTES,
};

export const GroupLayout = () => {
  return (
    <Box>
      <SimpleShowLayout>
        <Typography>Détails sur ce groupe</Typography>
        <TextField
          source="ref"
          label={<FieldLabel icon={<ReferenceIcon />}>Référence</FieldLabel>}
          {...FIELD_PROPS}
        />
        <TextField
          source="name"
          label={<FieldLabel icon={<NameIcon />}>Nom</FieldLabel>}
          {...FIELD_PROPS}
        />
        <DateField
          source="creation_datetime"
          label={
            <FieldLabel icon={<CreationDateIcon />}>
              Date de création
            </FieldLabel>
          }
          {...FIELD_PROPS}
        />
      </SimpleShowLayout>
    </Box>
  );
};

const GroupShow = () => {
  const {isManager} = useRole();

  const Actions = () => (
    <TopToolbar>
      <EditButton />
    </TopToolbar>
  );
  return (
    <Box>
      <Show actions={isManager() && <Actions />} title="Groupe">
        <GroupLayout />
      </Show>
      <GroupStudentList />
    </Box>
  );
};

export default GroupShow;
