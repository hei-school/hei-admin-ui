import {SpecializationField, WhoamiRoleEnum} from "@haapi/typescript-client";
import {SelectInput} from "react-admin";

const SPECIALIZATION_LIST = Object.entries(SpecializationField).map(
  ([value, name]) => ({
    value,
    name: getSpecializationValue(name),
  })
);

export function getSpecializationValue(specialization) {
  switch (specialization) {
    case SpecializationField.EL:
      return "Écosystéme Logiciel (EL)";
    case SpecializationField.TN:
      return "Transformation Numérique (TN)";
    default:
      return "Tronc commun";
  }
}

export function SelectSpecialization(props) {
  return (
    <SelectInput
      label="Parcours de Spécialization"
      source="specialization_field"
      choices={SPECIALIZATION_LIST}
      optionText="name"
      optionValue="value"
      fullWidth
      {...props}
    />
  );
}
