import {Sex} from "@haapi-3d601c85/typescript-client";
import {RadioButtonGroupInput} from "react-admin";

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
