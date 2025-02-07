import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";
import {Typography} from "@mui/material";
import {
  Datagrid,
  Button as MUIButton,
  TextField,
  useCreate,
  useListContext,
  useNotify,
  useRefresh,
} from "react-admin";
import {useNavigate} from "react-router-dom";

const ListContent = () => {
  const {selectedIds} = useListContext();

  return (
    <Datagrid bulkActionButtons={<AddStudentToMonitor />} rowClick={false}>
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
    </Datagrid>
  );
};

const AddStudentToMonitor = ({monitorId}) => {
  const {selectedIds} = useListContext();
  const [create, {isLoading}] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const navigate = useNavigate();

  const addStudentToMonitor = () => {
    create(
      "monitor-students",
      {data: {students_ids: selectedIds}},
      {
        onSuccess: () => {
          notify("Étudiants liés avec succès", {type: "success"});
          refresh();
          navigate(`/monitors/${monitorId}/students`);
        },
        onFailure: () => {
          notify("Erreur lors de l'insertion", {type: "error"});
        },
      }
    );
  };

  return (
    <MUIButton
      onClick={addStudentToMonitor}
      variant="contained"
      color="primary"
    >
      Ajouter
    </MUIButton>
  );
};

export const InsertStudentToMonitor = () => {
  const {id} = authProvider.getCachedWhoami();

  return (
    <HaList
      listProps={{
        resource: "students",
        title: " ",
        storeKey: "groupCreateStudents",
      }}
      title={
        <Typography variant="body2" fontWeight="bolder">
          Ajouter un étudiant
        </Typography>
      }
      mainSearch={{label: "Prénom·s", source: "first_name"}}
      hasDatagrid={false}
    >
      <ListContent monitorId={id} />
    </HaList>
  );
};
