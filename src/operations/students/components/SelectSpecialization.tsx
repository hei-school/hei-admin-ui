import {mapToChoices} from "@/utils";
import {SpecializationField} from "@haapi-b0fc7615/typescript-client";
import {SelectInput, SelectInputProps, required} from "react-admin";

export const SPECIALIZATION_VALUE: Record<SpecializationField, string> = {
  EL: "Écosystème Logiciel (EL)",
  TN: "Transformation Numérique (TN)",
  COMMON_CORE: "Tronc commun",
};

const SPECIALIZATION_CHOICES = mapToChoices(SPECIALIZATION_VALUE);

const DEFAULT_CHOICE = SPECIALIZATION_CHOICES[2];

export type SelectSpecializationProps = Partial<SelectInputProps> & {
  ignoreRole?: boolean;
};

export const SelectSpecialization = (
  props: Readonly<SelectSpecializationProps>
) => {
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
};
