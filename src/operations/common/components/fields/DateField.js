import {DateField as _DateField} from "react-admin";
import {DATETIME_OPTIONS, DATE_OPTIONS} from "../../../../utils/date";

export function DateField({source, label, showTime = false, ...fieldProps}) {
  return (
    <_DateField
      source={source}
      label={label}
      locales="fr-FR"
      options={showTime ? DATETIME_OPTIONS : DATE_OPTIONS}
      {...fieldProps}
    />
  );
}
