import {useNotify, useToggle} from "@/hooks";
import {RetakeExamSessionCreate} from "@/operations/retakeExamSessions/RetakeExamSessionCreate";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {
  RetakeExamSession,
  StudentLevel,
} from "@haapi-b0fc7615/typescript-client";
import {Add} from "@mui/icons-material";
import {Box, CircularProgress} from "@mui/material";
import {BookOpenIcon} from "lucide-react";
import {DateField, FunctionField, TextField, useGetOne} from "react-admin";
import {EmptyList3D} from "../common/components/EmptyList";
import {PendingCancellationBar, RoleBasedShowButton} from "./components";

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

const formatLevels = (level: RetakeExamSession) =>
  level.student_levels?.join(", ") || "-";

export const RetakeExamSessionList = () => {
  const {isAdmin, isManager, isStudent} = useRole();
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const notify = useNotify();
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
  if (isLoading) {
    return (
      <Box sx={SX_LOADING_CONTAINER}>
        <CircularProgress />
        <span>Chargement liste des sessions</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={SX_ERROR_CONTAINER}>
        <Box sx={SX_EMPTY_LIST_WRAPPER}>
          <EmptyList3D message="Aucune session trouvée" />
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
          filter: isStudent()
            ? {student_level: studentData?.level}
            : StudentLevel,
        }}
        actions={
          (isManager() || isAdmin()) && (
            <HaActionWrapper>
              <ButtonBase
                data-testid="create-button"
                icon={<Add />}
                onClick={toggleShowCreate}
              >
                Créer
              </ButtonBase>
            </HaActionWrapper>
          )
        }
      >
        <TextField source="title" label="Nom de la session" />
        <DateField source="date_from" label="Début" />
        <DateField source="date_to" label="Fin" />
        <FunctionField label="Niveaux" render={formatLevels} />
        <RoleBasedShowButton />
      </HaList>
      <Dialog
        title="Création d'une session de rattrapage"
        open={showCreate}
        onClose={toggleShowCreate}
      >
        <RetakeExamSessionCreate
          redirect={false}
          mutationOptions={{
            onSuccess: () => {
              notify("Session de rattrapage créée avec succès");
              toggleShowCreate();
            },
          }}
        />
      </Dialog>
    </Box>
  );
};
