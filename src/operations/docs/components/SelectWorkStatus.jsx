import {SelectInput, required} from "react-admin";

export const WORK_STATUS_VALUE = {
  HAVE_BEEN_WORKING: "A été en alternance",
  WILL_BE_WORKING: "Sera en alternance",
  WORKING: "Est en alternance",
};

const WORK_STATUS_CHOICES = Object.entries(WORK_STATUS_VALUE).map(
  ([value, label]) => ({value, label})
);

const DEFAULT_CHOICE = WORK_STATUS_CHOICES[2];

export function SelectWorkStatus(props) {
  return (
    <SelectInput
      label="Statut en alternance"
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
}
