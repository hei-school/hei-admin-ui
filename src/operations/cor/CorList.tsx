import {useNotify, useToggle} from "@/hooks";
import {DateField} from "@/operations/common/components/fields";
import {CorButtonAction} from "@/operations/cor/components/CorButtonAction";
import StatusChip from "@/operations/cor/components/StatusChip";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Cor} from "@haapi-b0fc7615/typescript-client";
import {Add as AddIcon, SafetyDivider} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FunctionField, TextField} from "react-admin";
import {CorCreate} from "./components/CorCreate";

export const CorList = () => {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const notify = useNotify();
  return (
    <Box>
      <HaList
        resource="cor"
        title="Liste des COR"
        emptyListMessage="La liste des COR est vide"
        icon={<SafetyDivider />}
        listProps={{
          className: "cor-list",
        }}
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
        datagridProps={{
          rowClick: false,
        }}
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
      >
        <TextField source="concerned_student.ref" label="Référence" />
        <TextField source="concerned_student.first_name" label="Prénom" />
        <TextField source="concerned_student.last_name" label="Nom" />
        <TextField source="description" label="Description" />
        <DateField source="interview_date" label="Date d'entretien" showTime />
        <DateField source="creation_datetime" label="Créé le" />
        <FunctionField<Cor>
          label="Statut"
          render={(cor) => {
            if (!cor) return null;
            return <StatusChip status={cor.status} />;
          }}
        />
        <FunctionField<Cor>
          label="Action"
          render={(cor) => {
            if (!cor) return null;
            return <CorButtonAction />;
          }}
        />
      </HaList>
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
