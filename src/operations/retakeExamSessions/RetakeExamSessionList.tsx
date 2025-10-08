import { useNotify, useToggle } from "@/hooks";
import { RetakeExamSessionCreate } from "@/operations/retakeExamSessions/RetakeExamSessionCreate";
import { Dialog } from "@/ui/components";
import { HaList } from "@/ui/haList";
import { ButtonBase, HaActionWrapper } from "@/ui/haToolbar";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import { BookOpenIcon } from "lucide-react";
import { ReactNode } from "react";
import { DateField, FunctionField, ShowButton, TextField } from "react-admin";

export const RetakeExamSessionList = () => {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const notify = useNotify();

  return (
    <Box>
      <HaList
        title="Liste des sessions de rattrapage"
        resource="retakeExams-sessions"
        icon={<BookOpenIcon />}
        datagridProps={{
          rowClick: false,
        }}
        mainSearch={{
          source: "title",
          label: "Nom du session",
        }}
        listProps={{
          title: "Liste des sessions de rattrapage",
        }}
        actions={
          <HaActionWrapper>
            <ButtonBase
              data-testid="create-button"
              icon={<Add />}
              onClick={toggleShowCreate}
            >
              Créer
            </ButtonBase>
          </HaActionWrapper>
        }
      >
        <TextField source="title" label="Non du session" />
        <DateField source="date_from" label="Début" />
        <DateField source="date_to" label="Fin" />
        <FunctionField
          label="Voir détail"
          render={(record: any, source?: string): ReactNode => (
            <Box sx={{ display: "flex", justifyContent: "center", width:"0.15" }}>
              <ShowButton record={record} />
            </Box>
          )}
        />
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
