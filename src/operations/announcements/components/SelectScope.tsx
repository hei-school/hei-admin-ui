import React from "react";
import {SelectInput} from "react-admin";
import {ANNOUNCEMENT_SCOPE} from "../AnnouncementList";
import {useRole} from "../../../security/hooks";
import {Scope} from "@haapi/typescript-client";

export const SCOPE_CHOICES = Object.entries(ANNOUNCEMENT_SCOPE).map(
  ([value, label]) => ({value, label})
);

export const SelectScope = ({setScope}: any) => {
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
