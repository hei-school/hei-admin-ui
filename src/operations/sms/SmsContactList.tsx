import {DeleteWithConfirm} from "@/operations/common/components";
import {HaList} from "@/ui/haList/HaList";
import {SmsContact} from "@haapi-b0fc7615/typescript-client";
import {Contacts as SmsContactIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {Datagrid, FunctionField, TextField, useListContext} from "react-admin";
import {SMS_OWNER_ROLE_LABEL} from "./constants";
import {SmsContactFilters} from "./SmsContactFilters";
import {SmsContactSearchResults} from "./SmsContactSearchResults";
import {MIN_SEARCH_LENGTH} from "./useSmsContactSearch";

const contactIdentity = (contact: SmsContact) =>
  [contact.name, contact.ownerRef].filter(Boolean).join(" — ");

const SmsContactSearchGroupedResults = ({
  searchInput,
}: {
  searchInput: string;
}) => {
  const {data = [], isLoading} = useListContext();

  return (
    <Box
      sx={{
        m: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <SmsContactSearchResults
        contacts={data as SmsContact[]}
        searchInput={searchInput}
        getLabel={contactIdentity}
        direction="column"
        emptyMessage={isLoading ? "Recherche…" : "Aucun contact trouvé"}
        renderTrailing={(contact) => (
          <DeleteWithConfirm
            resourceType="sms-contacts"
            id={contact.id}
            redirect=""
            confirmTitle="Retirer ce contact du carnet d'adresses SMS ?"
            confirmContent="Le compte utilisateur associé n'est pas affecté, seul le contact SMS est retiré."
          />
        )}
      />
    </Box>
  );
};

const SmsContactListBody = () => {
  const {filterValues} = useListContext();
  const searchInput: string = filterValues.search ?? "";

  if (searchInput.trim().length >= MIN_SEARCH_LENGTH) {
    return <SmsContactSearchGroupedResults searchInput={searchInput} />;
  }

  return (
    <Datagrid bulkActionButtons={false} rowClick={false}>
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
          <Box sx={{display: "flex", justifyContent: "center", width: "100%"}}>
            <DeleteWithConfirm
              resourceType="sms-contacts"
              id={record.id}
              redirect=""
              confirmTitle="Retirer ce contact du carnet d'adresses SMS ?"
              confirmContent="Le compte utilisateur associé n'est pas affecté, seul le contact SMS est retiré."
            />
          </Box>
        )}
      />
    </Datagrid>
  );
};

export const SmsContactList = () => {
  return (
    <Box>
      <HaList
        icon={<SmsContactIcon />}
        actions={undefined}
        title="Contacts SMS"
        resource="sms-contacts"
        filterButtons={<SmsContactFilters />}
        hasDatagrid={false}
        listProps={{title: "Contacts SMS"}}
        mainSearch={{
          label: "Rechercher par nom ou référence",
          source: "search",
        }}
      >
        <SmsContactListBody />
      </HaList>
    </Box>
  );
};
