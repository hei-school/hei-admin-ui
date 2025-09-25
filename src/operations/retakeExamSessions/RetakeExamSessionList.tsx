import {useNotify, useToggle} from "@/hooks";
import {RetakeExamSessionCreate} from "@/operations/retakeExamSessions/RetakeExamSessionCreate";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Add} from "@mui/icons-material";
import {Box} from "@mui/material";
import {BookOpenIcon} from "lucide-react";
import {DateField, TextField} from "react-admin";

export const RetakeExamessionList = () => {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const notify = useNotify();

  return (
    <Box>
      <HaList
        title="Listes des sessions de rattrapages"
        resource="retakeExams-sessions"
        icon={<BookOpenIcon />}
        datagridProps={{
          rowClick: false,
        }}
        listProps={{
          title: "Listes des sessions de rattrapages",
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
              notify("Session de rattrapage créé avec succès");
              toggleShowCreate();
            },
          }}
        />
      </Dialog>
    </Box>
  );
};
