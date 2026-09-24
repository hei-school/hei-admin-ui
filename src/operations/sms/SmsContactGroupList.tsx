import {DeleteWithConfirm} from "@/operations/common/components";
import {HaList} from "@/ui/haList/HaList";
import {SmsContactGroup} from "@haapi-b0fc7615/typescript-client";
import {Add, GroupWork as SmsContactGroupIcon} from "@mui/icons-material";
import {Box, Button} from "@mui/material";
import {useState} from "react";
import {FunctionField, Identifier, RaRecord, TextField} from "react-admin";
import {SmsContactGroupDialog} from "./SmsContactGroupDialog";

type DialogState = {groupId?: string} | null;

export const SmsContactGroupList = () => {
  const [dialogState, setDialogState] = useState<DialogState>(null);

  return (
    <Box>
      <HaList
        icon={<SmsContactGroupIcon />}
        title="Groupes de contacts SMS"
        resource="sms-contact-groups"
        actions={
          <Button
            startIcon={<Add />}
            onClick={() => setDialogState({})}
            data-testid="create-sms-contact-group"
          >
            Créer un groupe
          </Button>
        }
        datagridProps={{
          rowClick: (_id: Identifier, _resource: string, record: RaRecord) => {
            setDialogState({groupId: (record as SmsContactGroup).id});
            return false;
          },
        }}
        listProps={{title: "Groupes de contacts SMS"}}
      >
        <TextField source="name" label="Nom" />
        <TextField source="memberCount" label="Membres" />
        <FunctionField
          label="Action"
          render={(record: SmsContactGroup) => (
            <DeleteWithConfirm
              resourceType="sms-contact-groups"
              id={record.id}
              redirect=""
              confirmTitle="Supprimer ce groupe de contacts ?"
              confirmContent="Cette action ne supprime pas les contacts, seulement le groupe."
            />
          )}
          textAlign="center"
        />
      </HaList>
      {dialogState && (
        <SmsContactGroupDialog
          groupId={dialogState.groupId}
          onClose={() => setDialogState(null)}
        />
      )}
    </Box>
  );
};
