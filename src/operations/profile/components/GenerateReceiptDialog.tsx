import {DateTimeField} from "@/operations/common/components/fields";
import {Dialog} from "@/ui/components";
import {FC} from "react";
import {SaveButton, SimpleForm, TextInput} from "react-admin";

export const GenerateReceiptDialog: FC<{
  onClose: () => void;
  open: boolean;
}> = ({onClose, open}) => {
  return (
    <Dialog
      title="Veuillez remplir le formulaire ci-après pour générer le reçu"
      onClose={onClose}
      open={open}
    >
      <SimpleForm toolbar={<SaveButton />}>
        <DateTimeField source="from" label="Depuis" />
        <DateTimeField source="to" label="Jusqu'à" />
        <TextInput
          fullWidth
          source="destinationEmail"
          label="Email de destination"
          type="email"
        />
      </SimpleForm>
    </Dialog>
  );
};
