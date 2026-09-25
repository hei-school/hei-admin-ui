import {DeleteWithConfirm} from "@/operations/common/components";
import {HaList} from "@/ui/haList/HaList";
import {SmsContact} from "@haapi-b0fc7615/typescript-client";
import {Contacts as SmsContactIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FunctionField, TextField} from "react-admin";
import {SMS_OWNER_ROLE_LABEL} from "./constants";
import {SmsContactFilters} from "./SmsContactFilters";

export const SmsContactList = () => {
  return (
    <Box>
      <HaList
        icon={<SmsContactIcon />}
        actions={undefined}
        title="Contacts SMS"
        resource="sms-contacts"
        filterButtons={<SmsContactFilters />}
        datagridProps={{rowClick: false}}
        listProps={{title: "Contacts SMS"}}
      >
        <TextField source="name" label="Nom" />
        <TextField source="phoneNumber" label="Numéro" />
        <TextField source="ownerRef" label="Réf. compte" />
        <FunctionField
          label="Rôle"
          render={(contact: SmsContact) =>
            contact.ownerRole ? SMS_OWNER_ROLE_LABEL[contact.ownerRole] : "—"
          }
        />
        <FunctionField
          label="Action"
          render={(record: SmsContact) => (
            <DeleteWithConfirm
              resourceType="sms-contacts"
              id={record.id}
              redirect=""
              confirmTitle="Retirer ce contact du carnet d'adresses SMS ?"
              confirmContent="Le compte utilisateur associé n'est pas affecté, seul le contact SMS est retiré."
            />
          )}
          textAlign="center"
        />
      </HaList>
    </Box>
  );
};
