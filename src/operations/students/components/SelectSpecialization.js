import {SelectInput} from "react-admin";

export const SPECIALIZATION_VALUE = {
  EL: "Écosystéme Logiciel (EL)",
  TN: "Transformation Numérique (TN)",
  COMMON_CORE: "Tronc commun",
};

const SPECIALIZATION_CHOICES = Object.entries(SPECIALIZATION_VALUE).map(
  ([value, label]) => ({value, label})
);

export function SelectSpecialization(props) {
  return (
    <SelectInput
      label="Parcours de Spécialization"
      source="specialization_field"
      choices={SPECIALIZATION_CHOICES}
      optionText="name"
      optionValue="value"
      fullWidth
      {...props}
    />
  );
}
