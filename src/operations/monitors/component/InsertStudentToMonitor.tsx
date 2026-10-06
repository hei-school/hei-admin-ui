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
  return (
    <Datagrid bulkActionButtons={<AddStudentToMonitor />} rowClick={false}>
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
    </Datagrid>
  );
};

interface AddStudentToMonitorProps {
  monitorId?: string;
}

const AddStudentToMonitor = ({
  monitorId,
}: Readonly<AddStudentToMonitorProps>) => {
  const {selectedIds} = useListContext();
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const navigate = useNavigate();

  const addStudentToMonitor = () => {
    void create(
      "monitor-students",
      {data: {students_ids: selectedIds}},
      {
        onSuccess: () => {
          notify("Étudiants liés avec succès", {type: "success"});
          refresh();
          navigate(`/monitors/${monitorId}/students`);
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
      {/* the react-admin Button renders its child as the icon */}
      <span>Ajouter</span>
    </MUIButton>
  );
};

export const InsertStudentToMonitor = () => {
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
      <ListContent />
    </HaList>
  );
};
