import {Divider, Typography} from "@mui/material";
import {
  EditButton,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
} from "react-admin";
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "../../providers/authProvider";
import GroupStudentList from "./GroupStudentList";
import {DateField} from "../common/components/fields";

export const GroupLayout = () => {
  return (
    <SimpleShowLayout>
      <TextField source="ref" label="Référence" />
      <TextField source="name" label="Nom" />
      <DateField source="creation_datetime" label="Date de création" />
      <Divider />
      <Typography>Les étudiants dans ce groupe</Typography>
      <GroupStudentList />
    </SimpleShowLayout>
  );
};

const GroupShow = () => {
  const role = authProvider.getCachedRole();
  const isManager = role === WhoamiRoleEnum.MANAGER;

  const Actions = () => (
    <TopToolbar>
      <EditButton />
    </TopToolbar>
  );
  return (
    <Show actions={isManager && <Actions />} title="Groupe">
      <GroupLayout />
    </Show>
  );
};

export default GroupShow;
