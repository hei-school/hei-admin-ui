import {useEffect, useState} from "react";
import {
  Button,
  Confirm,
  CreateButton,
  Datagrid,
  DateInput,
  EditButton,
  List,
  SelectArrayInput,
  SimpleForm,
  TextField,
  TextInput,
  useListContext,
  useNotify,
  useRefresh,
} from "react-admin";
import {Box, Typography, Divider} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {PALETTE_COLORS} from "@/haTheme";
import {Create, StudentListWithBulkActions} from "../common/components";
import {EditToolBar} from "../utils";
import {toISO} from "@/utils/date";

const GroupCreate = () => {
  const [students, setStudents] = useState([]);

  return (
    <Create
      resource="groups"
      title="Création de groupe"
      redirect="show"
      transform={(group) => ({...group, students})}
    >
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput source="ref" label="Référence" required fullWidth />
        <TextInput source="name" label="Nom du groupe" required fullWidth />
        <DateInput
          source="creation_datetime"
          label="Date de création"
          required
          fullWidth
        />
        <StudentListWithBulkActions setStudentsIds={setStudents} />
      </SimpleForm>
    </Create>
  );
};
export default GroupCreate;
