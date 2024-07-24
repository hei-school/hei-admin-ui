import {Box} from "@mui/material";
import {School as StudentIcon} from "@mui/icons-material";
import {TextField, useRefresh} from "react-admin";
import {useParams} from "react-router-dom";
import {HaList} from "@/ui/haList";
import {useRole} from "@/security/hooks";
import {ExportButton} from "@/ui/haToolbar";
import {exportData, exportHeaders} from "../../utils";
import {ProfileFilters} from "../../profile/components/ProfileFilters";
import {InsertStudent, MoveStudent, RemoveStudent} from "./MigrateStudent";
import {GroupStudentsFilters} from "./GroupStudentFilters";

const GroupStudentList = () => {
  const params = useParams();

  const refresh = useRefresh();
  const {isManager} = useRole();

  const groupId = params.id;

  const ListActions = () => (
    <Box>
      {isManager() && <InsertStudent />}
      <ExportButton
        onExport={(list) => exportData(list, exportHeaders, "group-students")}
      />
      <GroupStudentsFilters />
    </Box>
  );

  return (
    <HaList
      listProps={{title: " ", queryOptions: {meta: {groupId}}}}
      actions={<ListActions />}
      title="Les étudiants dans ce groupe"
      icon={<StudentIcon />}
      resource="group-students"
      mainSearch={{label: "Prénom.s d'un étudiant", source: "first_name"}}
      datagridProps={{bulkActionButtons: false, rowClick: false}}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      {isManager() && (
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <MoveStudent />
          <RemoveStudent />
        </div>
      )}
    </HaList>
  );
};

export default GroupStudentList;
