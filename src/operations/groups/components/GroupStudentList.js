import {Box} from "@mui/material";
import {School as StudentIcon} from "@mui/icons-material";
import {TextField} from "react-admin";
import {useParams} from "react-router-dom";
import {exporter, exportHeaders} from "../../utils";
import {
  InsertStudentButton,
  MoveStudentButton,
  RemoveStudentButton,
} from "./MoveButton";
import {HaList} from "../../../ui/haList";
import {useRole} from "../../../security/hooks";
import {ExportButton} from "../../../ui/haToolbar";
import {ProfileFilters} from "../../profile";

const GroupStudentList = () => {
  const params = useParams();
  const {isManager} = useRole();

  const groupId = params.id;

  const ListActions = () => (
    <Box>
      {isManager() && <InsertStudentButton />}
      <ExportButton
        exportHandler={(list) =>
          exporter(list, exportHeaders, "group-students")
        }
      />
      <ProfileFilters />
    </Box>
  );

  return (
    <HaList
      listProps={{title: " ", queryOptions: {meta: {groupId}}}}
      actions={<ListActions />}
      title="Les étudiants dans ce groupe"
      icon={<StudentIcon />}
      resource="group-students"
      datagridProps={{bulkActionButtons: false, rowClick: false}}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      {isManager && (
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <MoveStudentButton />
          <RemoveStudentButton />
        </div>
      )}
    </HaList>
  );
};

export default GroupStudentList;
