import {toUTC} from "@/utils/date";
import {RetakeExamSession} from "@haapi-b0fc7615/typescript-client";
import {
  CreateProps,
  DateInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import {v4 as uuid} from "uuid";
import {Create} from "../common/components";

const validateDateTo = (value: string, allValues: any) => {
  if (!value) return "⚠ La date de fin est obligatoire";
  if (allValues?.date_from && new Date(value) < new Date(allValues.date_from)) {
    return "⚠ La date de fin doit être postérieure à la date de début";
  }
  return undefined;
};
export const RetakeExamSessionCreate = (props: Partial<CreateProps>) => {
  return (
    <Create
      title=" "
      transform={(session: RetakeExamSession) => ({
        ...session,
        id: uuid(),
        date_from:
          session?.date_from &&
          toUTC(new Date(session.date_from))?.toISOString(),
        date_to:
          session?.date_to && toUTC(new Date(session.date_to))?.toISOString(),
      })}
      {...props}
    >
      <SimpleForm>
        <TextInput
          source="title"
          label="Nom de la session de rattrapage"
          validate={required()}
          fullWidth
        />
        <DateInput
          source="date_from"
          label="Date de début de la session"
          validate={required()}
          fullWidth
        />
        <DateInput
          source="date_to"
          label="Date de fin de la session"
          validate={[required(), validateDateTo]}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
