import {useNotify} from "@/hooks";
import smsContactGroupsProvider from "@/providers/smsContactGroupsProvider";
import {Dialog} from "@/ui/components";
import {
  CrupdateSmsContactGroup,
  SmsContact,
} from "@haapi-b0fc7615/typescript-client";
import {useState} from "react";
import {
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useRefresh,
} from "react-admin";
import {FieldValues} from "react-hook-form";
import {SmsContactMultiSearchInput} from "./SmsContactMultiSearchInput";

interface SmsContactGroupDialogProps {
  onClose: () => void;
}

export const SmsContactGroupDialog = ({
  onClose,
}: SmsContactGroupDialogProps) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: FieldValues) => {
    setIsLoading(true);
    const contacts: SmsContact[] = values.contacts ?? [];
    const payload: CrupdateSmsContactGroup = {
      name: values.name,
      contactIds: contacts.map((contact) => contact.id!),
    };
    try {
      await smsContactGroupsProvider.saveOrUpdate([payload], {
        meta: {method: "CREATE"},
      });
      notify("Groupe créé avec succès", {type: "success"});
      refresh();
      onClose();
    } catch {
      notify("Erreur lors de la création du groupe", {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog title="Créer un groupe de contacts" open onClose={onClose}>
      <SimpleForm
        onSubmit={handleSubmit}
        defaultValues={{name: "", contacts: []}}
        toolbar={
          <Toolbar>
            <SaveButton
              label="Enregistrer"
              disabled={isLoading}
              data-testid="save-sms-contact-group"
            />
          </Toolbar>
        }
      >
        <TextInput
          source="name"
          label="Nom du groupe"
          fullWidth
          validate={required()}
        />
        <SmsContactMultiSearchInput
          source="contacts"
          label="Membres initiaux (optionnel)"
        />
      </SimpleForm>
    </Dialog>
  );
};
