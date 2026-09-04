import {Delete as DeleteIcon} from "@mui/icons-material";
import {Button, ButtonProps} from "@mui/material";
import {Confirm, useDelete, useRecordContext, useRedirect} from "react-admin";

import {CONFIRM_DIALOG_Z_INDEX} from "@/ui/constants/common_styles";
import {NOOP_FN} from "@/utils/noop";
import {useNotify, useToggle} from "../../../hooks";

export const DeleteWithConfirm = ({
  resourceType,
  text,
  confirmTitle,
  confirmContent,
  id,
  redirect,
  buttonProps = {},
  onDelete = NOOP_FN,
}: {
  resourceType: string;
  text?: string;
  confirmTitle: string;
  confirmContent: string;
  redirect: string;
  id?: string;
  buttonProps?: ButtonProps;
  onDelete?: () => void;
}) => {
  const [showConfirm, , toggleShowConfig] = useToggle();
  const record = useRecordContext();
  const doRedirect = useRedirect();
  const notify = useNotify();
  const [deleteOne, {isLoading, error}] = useDelete(resourceType, {
    id: record?.id || id || "",
    previousData: record,
  });

  const toggleView = (event: any) => {
    toggleShowConfig();
    event.stopPropagation();
  };
  const doDelete = () => {
    toggleShowConfig();
    deleteOne();
    notify("Élément supprimé avec succès.");
    onDelete();
    if (redirect) {
      doRedirect(redirect);
    }
  };
  if (error) {
    notify("Une erreur s'est produite lors de la suppression des ressources");
  }
  return (
    <div className="delete-button-wrapper">
      <Button
        color="error"
        size="small"
        data-testid="delete-button-confirm"
        disabled={isLoading}
        startIcon={<DeleteIcon />}
        onClick={toggleView}
        {...buttonProps}
      >
        {text}
      </Button>
      <Confirm
        fullWidth
        sx={{zIndex: CONFIRM_DIALOG_Z_INDEX}}
        isOpen={showConfirm}
        title={
          confirmTitle || "Confirmez-vous la suppression de la ressource ?"
        }
        onConfirm={doDelete}
        content={confirmContent}
        onClose={toggleShowConfig}
        ConfirmIcon={DeleteIcon}
        confirmColor="warning"
        confirm="Supprimer"
      />
    </div>
  );
};
