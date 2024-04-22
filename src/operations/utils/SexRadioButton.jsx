import {RadioButtonGroupInput} from "react-admin";
import {Sex} from "@haapi/typescript-client";

export const SexRadioButton = () => (
  <RadioButtonGroupInput
    source="sex"
    label="Sexe"
    choices={[
      {id: Sex.M, name: "Homme"},
      {id: Sex.F, name: "Femme"},
    ]}
  />
);
