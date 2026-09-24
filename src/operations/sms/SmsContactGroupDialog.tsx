import {useNotify} from "@/hooks";
import smsContactGroupsProvider from "@/providers/smsContactGroupsProvider";
import {Dialog} from "@/ui/components";
import {
  CrupdateSmsContactGroup,
  SmsContact,
  SmsContactGroupDetail,
} from "@haapi-b0fc7615/typescript-client";
import {useState} from "react";
import {
  required,
  SaveButton,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useGetList,
  useGetOne,
  useRefresh,
} from "react-admin";
import {FieldValues} from "react-hook-form";

interface SmsContactGroupDialogProps {
  groupId?: string;
  onClose: () => void;
}

export const SmsContactGroupDialog = ({
  groupId,
  onClose,
}: SmsContactGroupDialogProps) => {
  const isEditing = !!groupId;
  const notify = useNotify();
  const refresh = useRefresh();
  const [isLoading, setIsLoading] = useState(false);
  const {data: contacts = []} = useGetList("sms-contacts", {
    pagination: {page: 1, perPage: 500},
  });
  const {data: groupData, isLoading: isGroupLoading} = useGetOne(
    "sms-contact-groups",
    {id: groupId ?? ""},
    {enabled: isEditing}
  );
  const group = groupData as SmsContactGroupDetail | undefined;

  const handleSubmit = async (values: FieldValues) => {
    setIsLoading(true);
    const payload: CrupdateSmsContactGroup = {
      name: values.name,
      contactIds: values.contactIds ?? [],
    };
    try {
      await smsContactGroupsProvider.saveOrUpdate([payload], {
        meta: {method: isEditing ? "UPDATE" : "CREATE", id: groupId},
      });
      notify(
        isEditing ? "Groupe modifié avec succès" : "Groupe créé avec succès",
        {type: "success"}
      );
      refresh();
      onClose();
    } catch {
      notify("Erreur lors de l'enregistrement du groupe", {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      title={
        isEditing
          ? "Modifier le groupe de contacts"
          : "Créer un groupe de contacts"
      }
      open
      onClose={onClose}
    >
      {(!isEditing || !isGroupLoading) && (
        <SimpleForm
          onSubmit={handleSubmit}
          defaultValues={{
            name: group?.name ?? "",
            contactIds: group?.members?.map((member) => member.id) ?? [],
          }}
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
          <SelectArrayInput
            source="contactIds"
            label="Membres"
            choices={contacts}
            optionText={(contact: SmsContact) =>
              [contact.name, contact.phoneNumber].filter(Boolean).join(" — ")
            }
            fullWidth
          />
        </SimpleForm>
      )}
    </Dialog>
  );
};
