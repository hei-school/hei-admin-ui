import {EnableStatus} from "@haapi-3d601c85/typescript-client";
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
      {id: EnableStatus.ALUMNI, name: "Alumni"},
    ]}
  />
);

if (typeof window !== "undefined") {
  window.StatusRadioButton = StatusRadioButton;
}
