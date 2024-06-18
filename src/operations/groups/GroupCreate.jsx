import {useEffect, useState} from "react";
import {
  Button,
  Confirm,
  CreateButton,
  Datagrid,
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
import {Create} from "../common/components";
import {EditToolBar} from "../utils";

const ListContent = ({setStudents}) => {
  const {selectedIds} = useListContext();

  useEffect(() => {
    setStudents(selectedIds);
  }, [selectedIds]);

  return (
    <Datagrid bulkActionButtons={<></>} rowClick={false}>
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
    </Datagrid>
  );
};

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
        <HaList
          listProps={{
            resource: "students",
            title: " ",
            storeKey: "groupCreateStudents",
          }}
          title={
            <Typography variant="body2" fontWeight="bolder">
              Ajouter des étudiants dans le groupe
            </Typography>
          }
          mainSearch={{label: "Prénom·s", source: "first_name"}}
          hasDatagrid={false}
        >
          <ListContent setStudents={setStudents} />
        </HaList>
      </SimpleForm>
    </Create>
  );
};
export default GroupCreate;
