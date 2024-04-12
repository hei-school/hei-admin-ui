import { SelectInput, required } from "react-admin";

export const SPECIALIZATION_VALUE = {
  EL: "Écosystème Logiciel (EL)",
  TN: "Transformation Numérique (TN)",
  COMMON_CORE: "Tronc commun",
};

const SPECIALIZATION_CHOICES = Object.entries(SPECIALIZATION_VALUE).map(
  ([value, label]) => ({ value, label }),
);

const DEFAULT_CHOICE = SPECIALIZATION_CHOICES[2];

export function SelectSpecialization(props) {
  return (
    <SelectInput
      label="Parcours de Spécialisation"
      source="specialization_field"
      choices={SPECIALIZATION_CHOICES}
      optionText="label"
      optionValue="value"
      defaultValue={DEFAULT_CHOICE.value}
      validate={required()}
      fullWidth
      {...props}
    />
  );
}
