import {FileDownloader} from "@/operations/common/components";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {Download, School as StudentIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {TextField, useDataProvider, useRefresh} from "react-admin";
import {useParams} from "react-router-dom";
import {GroupStudentsFilters} from "./GroupStudentFilters";
import {InsertStudent, MoveStudent, RemoveStudent} from "./MigrateStudent";

const GroupStudentList = () => {
  const params = useParams();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const {isManager, isAdmin} = useRole();

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
      {(isManager() || isAdmin()) && <InsertStudent />}
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
      {(isManager() || isAdmin()) && (
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <MoveStudent />
          <RemoveStudent />
        </div>
      )}
    </HaList>
  );
};

export default GroupStudentList;
