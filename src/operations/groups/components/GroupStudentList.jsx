import {Box} from "@mui/material";
import {School as StudentIcon, Download} from "@mui/icons-material";
import {Button, TextField, useDataProvider, useRefresh} from "react-admin";
import {useParams} from "react-router-dom";
import {HaList} from "@/ui/haList";
import {useRole} from "@/security/hooks";
import {ExportButton} from "@/ui/haToolbar";
import {exportData, exportHeaders} from "../../utils";
import {ProfileFilters} from "../../profile/components/ProfileFilters";
import {InsertStudent, MoveStudent, RemoveStudent} from "./MigrateStudent";
import {GroupStudentsFilters} from "./GroupStudentFilters";
import {FileDownloader} from "@/operations/common/components";

const GroupStudentList = () => {
  const params = useParams();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const {isManager} = useRole();

  const groupId = params.id;

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("group-export", {
      id: groupId,
    });

    return {data: file};
  };

  const ListActions = () => (
    <Box>
      {isManager() && <InsertStudent />}
      <FileDownloader
        downloadFunction={downloadFile}
        fileName="Liste des étudiants"
        startIcon={<Download />}
        sx={{
          textTransform: "none",
          color: "inherit",
          opacity: "0.8",
          padding: "0.5rem 1.1rem",
          gap: "0.8rem",
        }}
        buttonText="Exporter"
        successMessage="Exportation en cours..."
        errorMessage="Erreur lors de l'exportation du fichier."
        fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
