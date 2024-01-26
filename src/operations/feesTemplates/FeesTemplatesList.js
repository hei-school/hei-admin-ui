import { EditButton, FunctionField, TextField } from "react-admin";
import { HaList } from "../../ui/haList";
import { CreateButton } from "../../ui/haToolbar";
import { prettyPrintMoney } from "../utils";

function FeesTemplatesList() {
  return (
    <HaList
      title="Type de frais prédefinies"
      mainSearch={{ source: "name", label: "label" }}
      listProps={{ title: "Frais Prédéfinies" }}
      datagridProps={{ rowClick: "edit" }}
      actions={<CreateButton/>}
    >
      <TextField source="name" label="Label" />
      <FunctionField
        label="Montant de la mensualité"
        render={(feestype) => prettyPrintMoney(feestype.amount)}
      />
      <TextField source="number_of_payments" label="Nombre de mensualités" />
      <EditButton />
    </HaList >
  );
}

export default FeesTemplatesList;
