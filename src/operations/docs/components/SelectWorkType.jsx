import {mapToChoices} from "@/utils";
import {SelectInput, required} from "react-admin";

export const WORK_TYPE_VALUE = {
  WORKER_STUDENT: "Alternance",
  BUSINESS_OWNER: "Création d'entreprise",
  INTERN_STUDENT: "Stage à temps plein",
  INTERN_PROJECT: "Projet d'école",
};

const WORK_TYPE_CHOICES = mapToChoices(WORK_TYPE_VALUE);

const DEFAULT_CHOICE = WORK_TYPE_CHOICES[0];

export function SelectWorkType(props) {
  return (
    <SelectInput
      label="Type d'expérience professionnelle"
      source="experience_type"
      choices={WORK_TYPE_CHOICES}
      optionText="label"
      optionValue="value"
      defaultValue={DEFAULT_CHOICE.value}
      validate={required()}
      fullWidth
      {...props}
    />
  );
}
