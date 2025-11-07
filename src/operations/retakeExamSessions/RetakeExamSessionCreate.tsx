import { toUTC } from "@/utils/date";
import { RetakeExamSession, StudentLevel } from "@haapi-b0fc7615/typescript-client";
import {
  CreateProps,
  DateInput,
  SimpleForm,
  TextInput,
  SelectArrayInput,
  required,
} from "react-admin";
import { v4 as uuid } from "uuid";
import { Create } from "../common/components";

const validateDateTo = (value: string, allValues: any) => {
  if (!value) return "⚠ La date de fin est obligatoire";
  if (allValues?.date_from && new Date(value) < new Date(allValues.date_from)) {
    return "⚠ La date de fin doit être postérieure à la date de début";
  }
  return undefined;
};
const levelChoices = [
  { id: "ALL", name: "Tous les niveaux" },
  { id: StudentLevel.L1, name: "L1" },
  { id: StudentLevel.L2, name: "L2" },
  { id: StudentLevel.L3, name: "L3" },
  { id: StudentLevel.M1, name: "M1" },
  { id: StudentLevel.M2, name: "M2" },
];
export const RetakeExamSessionCreate = (props: Partial<CreateProps>) => {
  return (
    <Create
      title=" "
      transform={(session: RetakeExamSession & { levels?: string[] }) => {
        const selectedLevels = session.levels?.includes("ALL")
          ? [StudentLevel.L1, StudentLevel.L2, StudentLevel.L3, StudentLevel.M1, StudentLevel.M2]
          : session.levels?.filter(level => level !== "ALL");
        return {
          ...session,
          id: uuid(),
          levels: selectedLevels,
          date_from:
            session?.date_from &&
            toUTC(new Date(session.date_from))?.toISOString(),
          date_to:
            session?.date_to && toUTC(new Date(session.date_to))?.toISOString(),
        };
      }}
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
        <SelectArrayInput
          source="student_levels"
          label="Niveau"
          choices={levelChoices}
          validate={required()}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};