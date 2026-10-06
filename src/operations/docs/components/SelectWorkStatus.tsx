import {mapToChoices} from "@/utils";
import {WorkStudyStatus} from "@haapi-b0fc7615/typescript-client";
import {SelectInput, SelectInputProps, required} from "react-admin";

export const WORK_STATUS_VALUE: Record<WorkStudyStatus, string> = {
  HAVE_BEEN_WORKING: "A eu une expérience professionnelle",
  WILL_BE_WORKING: "Aura une expérience professionnelle",
  WORKING: "Est en expérience professionnelle",
  NOT_WORKING: "N'a pas d'expérience professionnelle",
};

const WORK_STATUS_CHOICES = mapToChoices(WORK_STATUS_VALUE);

const DEFAULT_CHOICE = WORK_STATUS_CHOICES[2];

export const SelectWorkStatus = (
  props: Readonly<Partial<SelectInputProps>>
) => {
  return (
    <SelectInput
      label="Statut professionnel"
      source="work_study_status"
      choices={WORK_STATUS_CHOICES}
      optionText="label"
      optionValue="value"
      defaultValue={DEFAULT_CHOICE.value}
      validate={required()}
      fullWidth
      {...props}
    />
  );
};
