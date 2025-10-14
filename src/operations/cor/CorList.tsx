import {useNotify, useToggle} from "@/hooks";
import {Dialog} from "@/ui/components";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Add as AddIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {CorCreate} from "./CorCreate";
import {CorFields} from "./CorFields";

export const CorList = () => {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const notify = useNotify();
  return (
    <Box>
      <CorFields
        resource="cor"
        title="Liste des C.O.R."
        actions={
          <HaActionWrapper>
            <ButtonBase
              data-testid="create-button"
              icon={<AddIcon />}
              onClick={toggleShowCreate}
              closeAction
            >
              Créer
            </ButtonBase>
          </HaActionWrapper>
        }
      />
      <Dialog
        title="Création d'un COR"
        open={showCreate}
        onClose={toggleShowCreate}
      >
        <CorCreate
          redirect={false}
          mutationOptions={{
            onSuccess: () => {
              notify("COR créer avec succès");
              toggleShowCreate();
            },
          }}
        />
      </Dialog>
    </Box>
  );
};
