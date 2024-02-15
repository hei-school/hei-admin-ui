import { useRef } from "react";
import { Confirm, DeleteButton as _DeleteButton } from "react-admin";
import { Button } from "@mui/material"
import { Delete as DeleteIcon } from "@mui/icons-material"

import { useToggle } from "../../../hooks/useToggle";


export function DeleteButton({ text = "Supprimer", label, redirect }) {
  const [showConfirm, , toggleShowConfig] = useToggle();
  const deleteButtonLink = useRef(null);

  return (
    <div className="delete-button-wrapper">
      <_DeleteButton style={{ display: "none" }} ref={deleteButtonLink} hidden redirect={redirect} />
      <Button
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={toggleShowConfig}
      >
        {text}
      </Button>
      <Confirm
        fullWidth
        isOpen={showConfirm}
        title={label || "Confirmez-vous la suppression de la ressource ?"}
        onConfirm={() => deleteButtonLink.current.click()}
        onClose={toggleShowConfig}
      />
    </div>
  )
}
