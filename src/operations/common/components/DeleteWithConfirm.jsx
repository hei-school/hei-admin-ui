import {Delete as DeleteIcon} from "@mui/icons-material";
import {Button} from "@mui/material";
import {Confirm, useDelete, useRecordContext, useRedirect} from "react-admin";

import {useNotify, useToggle} from "../../../hooks";

export function DeleteWithConfirm({
  resourceType,
  text = "Supprimer",
  confirmTitle,
  confirmContent,
  redirect,
}) {
  const [showConfirm, , toggleShowConfig] = useToggle();
  const record = useRecordContext();
  const doRedirect = useRedirect();
  const notify = useNotify();
  const [deleteOne, {isLoading, error}] = useDelete(resourceType, {
    id: record?.id || "",
    previousData: record,
  });

  const toggleView = (event) => {
    toggleShowConfig();
    event.stopPropagation();
  };

  const doDelete = () => {
    toggleShowConfig();
    deleteOne();
    notify("Élément supprimé avec succès.");

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
      >
        {text}
      </Button>
      <Confirm
        fullWidth
        sx={{zIndex: 99999}}
        isOpen={showConfirm}
        title={
          confirmTitle || "Confirmez-vous la suppression de la ressource ?"
        }
        onConfirm={doDelete}
        content={confirmContent}
        onClose={toggleShowConfig}
      />
    </div>
  );
}
