import {FileDownloader} from "@/operations/common/components";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {Download, School as StudentIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {TextField, useDataProvider} from "react-admin";
import {useParams} from "react-router-dom";
import {GroupStudentsFilters} from "./GroupStudentFilters";
import {InsertStudent, MoveStudent, RemoveStudent} from "./MigrateStudent";

interface ListActionsProps {
  groupId?: string;
  canManageStudents: boolean;
}

// the export provider returns the xlsx content in "file"
interface GroupExport {
  file: ArrayBuffer;
}

const ListActions = ({
  groupId,
  canManageStudents,
}: Readonly<ListActionsProps>) => {
  const dataProvider = useDataProvider();

  const downloadFile = async () => {
    const {data} = await dataProvider.getOne("group-export", {
      id: groupId,
    });

    const {file}: GroupExport = data;
    return {data: file};
  };

  return (
    <Box>
      {canManageStudents && <InsertStudent />}
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
};

const GroupStudentList = () => {
  const params = useParams();
  const {isManager, isAdmin} = useRole();

  const groupId = params.id;
  const canManageStudents = isManager() || isAdmin();

  return (
    <HaList
      listProps={{title: " ", queryOptions: {meta: {groupId}}}}
      actions={
        <ListActions groupId={groupId} canManageStudents={canManageStudents} />
      }
      title="Les étudiants dans ce groupe"
      icon={<StudentIcon />}
      resource="group-students"
      mainSearch={{label: "Prénom.s d'un étudiant", source: "first_name"}}
      datagridProps={{bulkActionButtons: false, rowClick: false}}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="first_name" label="Prénom·s" />
      <TextField source="last_name" label="Nom·s" />
      {canManageStudents && (
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <MoveStudent />
          <RemoveStudent />
        </div>
      )}
    </HaList>
  );
};

export default GroupStudentList;
