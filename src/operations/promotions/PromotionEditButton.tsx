import { Button, SaveButton, SimpleForm, TextInput, Toolbar, required } from "react-admin";
import { Create as EditIcon } from "@mui/icons-material"
import { CrupdatePromotion, Promotion } from "@haapi/typescript-client";
import { Edit } from "../common/components"
import { PromotionDialog } from "./components";
import { useToggle, useNotify } from "@/hooks";

export function PromotionEditButton({ id }: { id: string }) {
  const [showEdit, _set, toggleEdit] = useToggle();
  const notify = useNotify();

  return (
    <>
      <Button
        onClick={toggleEdit}
        startIcon={<EditIcon />}
        label="EDITER"
      />
      <PromotionDialog
        title="Modification d'une promotion"
        open={showEdit}
        onClose={toggleEdit}
      >
        <Edit
          id={id}
          title=" "
          actions={false}
          redirect={false}
          mutationOptions={{
            onSuccess: () => {
              notify("Promotion mise à jour")
              toggleEdit();
            }
          }}
          transform={(promotion: Promotion): CrupdatePromotion => {
            return { name: promotion.name, ref: promotion.ref, id: promotion.id };
          }}
        >
          <SimpleForm toolbar={<Toolbar><SaveButton /></Toolbar>}>
            <TextInput source="name" label="Nom" validate={required()} fullWidth />
            <TextInput source="ref" label="Référence" validate={required()} fullWidth />
          </SimpleForm>
        </Edit>
      </PromotionDialog>
    </>
  )
}
