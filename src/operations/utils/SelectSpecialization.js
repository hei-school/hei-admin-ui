import {SpecializationField, WhoamiRoleEnum} from "@haapi/typescript-client";
import {SelectInput} from "react-admin";
import authProvider from "../../providers/authProvider";

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

export function SelectSpecialization({ignoreRole = false, ...props}) {
  const isStudent = authProvider.getCachedRole() == WhoamiRoleEnum.STUDENT;

  const SpecializationList = Object.entries(SpecializationField).map((el) => ({
    value: el[0],
    name: getSpecializationValue(el[1]),
  }));

  return ignoreRole || isStudent ? (
    <SelectInput
      label="Parcours de Spécialization"
      source="specialization_field"
      choices={SpecializationList}
      optionText="name"
      optionValue="value"
      fullWidth
      required
      {...props}
    />
  ) : null;
}
