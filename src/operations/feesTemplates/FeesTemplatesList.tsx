import {FeeTemplate} from "@haapi-b0fc7615/typescript-client";
import {AttachMoney} from "@mui/icons-material";
import {EditButton, FunctionField, TextField} from "react-admin";

import {HaList} from "../../ui/haList";
import {CreateButton} from "../../ui/haToolbar";
import {renderMoney} from "../common/utils/money";

const FeesTemplatesList = () => {
  return (
    <HaList
      title="Type de frais prédéfini"
      mainSearch={{source: "name", label: "Nom"}}
      listProps={{title: "Frais Prédéfinis"}}
      filterIndicator={false}
      datagridProps={{rowClick: "edit"}}
      actions={<CreateButton />}
      icon={<AttachMoney />}
    >
      <TextField source="name" label="Nom" />
      <FunctionField
        label="Montant de la mensualité"
        render={(feetype: FeeTemplate) => renderMoney(feetype.amount)}
      />
      <TextField source="number_of_payments" label="Nombre de mensualités" />
      <EditButton />
    </HaList>
  );
};

export default FeesTemplatesList;
