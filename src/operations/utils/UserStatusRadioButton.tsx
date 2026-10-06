import {EnableStatus} from "@haapi-b0fc7615/typescript-client";
import {RadioButtonGroupInput, RadioButtonGroupInputProps} from "react-admin";

export const StatusRadioButton = (
  props: Readonly<Partial<RadioButtonGroupInputProps>>
) => (
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

declare global {
  interface Window {
    StatusRadioButton?: typeof StatusRadioButton;
  }
}

if (typeof window !== "undefined") {
  window.StatusRadioButton = StatusRadioButton;
}
