import {useToggle} from "@/hooks";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {RetakeExamSession} from "@haapi-b0fc7615/typescript-client";
import {Box, CircularProgress} from "@mui/material";
import {BookOpenIcon} from "lucide-react";
import {useState} from "react";
import {DateField, FunctionField, TextField, useGetOne} from "react-admin";
import {EmptyList3D} from "../common/components/EmptyList";
import {PendingCancellationBar, RoleBasedShowButton} from "./components";
import {
  CreateSessionButton,
  EditSessionButton,
  RetakeExamSessionActions,
} from "./components/RetakeExamSessionActions";

const SX_LOADING_CONTAINER = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
  gap: 2,
};

const SX_ERROR_CONTAINER = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
};

const SX_EMPTY_LIST_WRAPPER = {
  display: "flex",
  height: "90vh",
  width: "110%",
};

const formatLevels = (record: RetakeExamSession) =>
  record.student_levels?.join(", ") || "-";

export const RetakeExamSessionList = () => {
  const {isAdmin, isManager, isStudent} = useRole();
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const [showEdit, setShowEdit] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<RetakeExamSession | null>(null);
  const StudentId = authProvider.getCachedWhoami().id;

  const {
    data: studentData,
    isLoading,
    error,
  } = useGetOne(
    "students",
    {id: StudentId || ""},
    {enabled: isStudent() && !!StudentId}
  );

  const handleEdit = (record: RetakeExamSession) => {
    setSelectedSession(record);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedSession(null);
  };
  if (isLoading) {
    return (
      <Box sx={SX_LOADING_CONTAINER}>
        <CircularProgress />
        <span>Chargement liste des sessions</span>
      </Box>
    );
  }
  if (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";

    return (
      <Box sx={SX_ERROR_CONTAINER}>
        <Box sx={SX_EMPTY_LIST_WRAPPER}>
          <EmptyList3D message={message} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {(isAdmin() || isManager()) && <PendingCancellationBar />}
      <HaList
        title="Liste des sessions de rattrapage"
        resource="retakeExams-sessions"
        icon={<BookOpenIcon />}
        datagridProps={{rowClick: false}}
        mainSearch={{
          source: "title",
          label: "Nom de la session",
        }}
        listProps={{
          title: "Liste des sessions de rattrapage",
          filter: isStudent() ? {student_level: studentData?.level} : {},
        }}
        actions={
          (isAdmin() || isManager()) && (
            <CreateSessionButton onClick={toggleShowCreate} />
          )
        }
      >
        <TextField source="title" label="Nom de la session" />
        <DateField source="date_from" label="Début" />
        <DateField source="date_to" label="Fin" />
        <FunctionField label="Niveaux" render={formatLevels} />
        {(isAdmin() || isManager()) && (
          <EditSessionButton onEdit={handleEdit} label="Éditer" />
        )}
        <RoleBasedShowButton />
      </HaList>

      <RetakeExamSessionActions
        showCreate={showCreate}
        onCloseCreate={toggleShowCreate}
        showEdit={showEdit}
        onCloseEdit={handleCloseEdit}
        selectedSession={selectedSession}
      />
    </Box>
  );
};
