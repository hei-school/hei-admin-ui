import {EnableStatus} from "@haapi/typescript-client";
import {RadioButtonGroupInput} from "react-admin";

export const StatusRadioButton = (props) => (
  <RadioButtonGroupInput
    {...props}
    source="status"
    label="Statut"
    choices={[
      {id: EnableStatus.ENABLED, name: "Actif·ve"},
      {id: EnableStatus.DISABLED, name: "Quitté.e"},
      {id: EnableStatus.SUSPENDED, name: "Suspendu.e"},
    ]}
  />
);
