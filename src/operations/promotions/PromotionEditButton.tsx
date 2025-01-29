import {useNotify, useToggle} from "@/hooks";
import {Dialog} from "@/ui/components";
import {CrupdatePromotion, Promotion} from "@haapi/typescript-client";
import {Create as EditIcon} from "@mui/icons-material";
import {
  Button,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  required,
} from "react-admin";
import {Edit} from "../common/components";

export function PromotionEditButton({id}: {id: string}) {
  const [showEdit, _set, toggleEdit] = useToggle();
  const notify = useNotify();

  return (
    <>
      <Button
        onClick={toggleEdit}
        startIcon={<EditIcon />}
        label="EDITER"
        data-testid="edit-button"
        variant="contained"
        sx={{py: "5px", mt: 2}}
      />
      <Dialog
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
              notify("Promotion mise à jour");
              toggleEdit();
            },
          }}
          transform={(promotion: Promotion): CrupdatePromotion => {
            return {name: promotion.name, ref: promotion.ref, id: promotion.id};
          }}
        >
          <SimpleForm
            toolbar={
              <Toolbar>
                <SaveButton data-testid="edit-button" />
              </Toolbar>
            }
          >
            <TextInput
              source="name"
              label="Nom"
              validate={required()}
              fullWidth
            />
            <TextInput
              source="ref"
              label="Référence"
              validate={required()}
              fullWidth
            />
          </SimpleForm>
        </Edit>
      </Dialog>
    </>
  );
}
