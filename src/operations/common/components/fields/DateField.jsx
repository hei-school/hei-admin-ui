import {EMPTY_TEXT} from "@/ui/constants";
import {DateField as RaDateField} from "react-admin";
import {DATETIME_OPTIONS, DATE_OPTIONS} from "../../../../utils/date";

export function DateField({source, label, showTime = false, ...fieldProps}) {
  return (
    <RaDateField
      source={source}
      label={label}
      locales="fr-FR"
      options={showTime ? DATETIME_OPTIONS : DATE_OPTIONS}
      emptyText={EMPTY_TEXT}
      {...fieldProps}
    />
  );
}
