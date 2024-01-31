import {EditButton, FunctionField, TextField} from "react-admin";
import {AttachMoney} from "@mui/icons-material";
import {HaList} from "../../ui/haList";
import {CreateButton} from "../../ui/haToolbar";
import {prettyPrintMoney} from "../utils";

function FeesTemplatesList() {
  return (
    <HaList
      title="Type de frais prédefinies"
      mainSearch={{source: "name", label: "label"}}
      listProps={{title: "Frais Prédéfinies"}}
      filterIndicator={false}
      datagridProps={{rowClick: "edit"}}
      actions={<CreateButton />}
      icon={<AttachMoney />}
    >
      <TextField source="name" label="Label" />
      <FunctionField
        label="Montant de la mensualité"
        render={(feetype) => prettyPrintMoney(feetype.amount)}
      />
      <TextField source="number_of_payments" label="Nombre de mensualités" />
      <EditButton />
    </HaList>
  );
}

export default FeesTemplatesList;
