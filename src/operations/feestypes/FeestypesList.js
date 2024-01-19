import {EditButton, FunctionField, TextField} from "react-admin";
import {HaList} from "../../ui/haList";
import {prettyPrintMoney} from "../utils";

export function FeestypesList() {
  return (
    <HaList
      title="Type de frais prédefinies"
      mainSearch={{source: "name", label: "label"}}
      listProps={{title: "Configuration"}}
      datagridProps={{rowClick: "edit"}}
    >
      <TextField source="name" label="Label" />
      <FunctionField
        label="Montant de la mensualité"
        render={(feestype) => prettyPrintMoney(feestype.amount)}
      />
      <TextField source="number_of_payments" label="Nombre de mensualités" />
      <EditButton />
    </HaList>
  );
}
