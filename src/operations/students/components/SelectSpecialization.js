import {SelectInput} from "react-admin";

export const SPECIALIZATION_VALUE = {
  EL: "Écosystéme Logiciel (EL)",
  TN: "Transformation Numérique (TN)",
  COMMON_CORE: "Tronc commun",
};

export function SelectSpecialization(props) {
  const specializationChoices = Object.entries(SPECIALIZATION_VALUE).map(
    ([value, label]) => ({value, label})
  );

  return (
    <SelectInput
      label="Parcours de Spécialization"
      source="specialization_field"
      choices={specializationChoices}
      optionText="name"
      optionValue="value"
      fullWidth
      {...props}
    />
  );
}
