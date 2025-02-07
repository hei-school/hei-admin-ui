import {Dispatch, FC, SetStateAction} from "react";

import {useRole} from "@/security/hooks";
import {mapToChoices} from "@/utils";
import {SelectInput} from "react-admin";
import {ANNOUNCEMENT_SCOPE} from "../utils/constants/announcementsScopes";

export const SCOPE_CHOICES = mapToChoices(ANNOUNCEMENT_SCOPE);

interface SelectScopeProps {
  setScope: Dispatch<SetStateAction<string>>;
}

export const SelectScope: FC<SelectScopeProps> = ({setScope}) => {
  const {isTeacher} = useRole();
  return (
    <SelectInput
      label="Portée de l'annonce"
      source="scope"
      choices={isTeacher() ? [SCOPE_CHOICES[2]] : SCOPE_CHOICES}
      optionText="label"
      optionValue="value"
      defaultValue={SCOPE_CHOICES[0].value}
      onChange={(event) => setScope(event.target.value)}
      fullWidth
    />
  );
};
