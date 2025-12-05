import {RetakeExamSessionCreate} from "@/operations/retakeExamSessions/RetakeExamSessionCreate";
import {RetakeExamSessionEdit} from "@/operations/retakeExamSessions/RetakeExamSessionEdit";
import {useRole} from "@/security/hooks";
import {Dialog} from "@/ui/components";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {RetakeExamSession} from "@haapi-b0fc7615/typescript-client";
import {Add, Edit as EditIcon} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import {FunctionField} from "react-admin";

export const CreateSessionButton = ({onClick}: {onClick: () => void}) => {
  return (
    <HaActionWrapper>
      <ButtonBase data-testid="create-button" icon={<Add />} onClick={onClick}>
        Créer
      </ButtonBase>
    </HaActionWrapper>
  );
};

interface EditSessionButtonProps {
  onEdit: (record: RetakeExamSession) => void;
  label?: string;
}

export const EditSessionButton = ({
  onEdit,
  label = "Éditer",
}: EditSessionButtonProps) => {
  const {isAdmin, isManager} = useRole();
  if (!isAdmin() && !isManager()) return null;

  return (
    <FunctionField
      label={label}
      render={(record: RetakeExamSession) => (
        <IconButton size="small" onClick={() => onEdit(record)} color="primary">
          <EditIcon />
        </IconButton>
      )}
    />
  );
};

interface RetakeExamSessionActionsProps {
  showCreate: boolean;
  onCloseCreate: () => void;
  showEdit: boolean;
  onCloseEdit: () => void;
  selectedSession: RetakeExamSession | null;
}

export const RetakeExamSessionActions = ({
  showCreate,
  onCloseCreate,
  showEdit,
  onCloseEdit,
  selectedSession,
}: RetakeExamSessionActionsProps) => {
  return (
    <Box>
      <Dialog
        title="Création d'une session de rattrapage"
        open={showCreate}
        onClose={onCloseCreate}
      >
        <RetakeExamSessionCreate onSuccess={onCloseCreate} />
      </Dialog>
      <Dialog
        title="Modifier la session de rattrapage"
        open={showEdit}
        onClose={onCloseEdit}
      >
        {selectedSession && (
          <RetakeExamSessionEdit {...selectedSession} onSuccess={onCloseEdit} />
        )}
      </Dialog>
    </Box>
  );
};
