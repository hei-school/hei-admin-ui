import {toUTC} from "@/utils/date";
import {
  RetakeExamSession,
  StudentLevel,
} from "@haapi-b0fc7615/typescript-client";
import {
  CreateProps,
  DateInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  required,
  useInput,
} from "react-admin";
import {v4 as uuid} from "uuid";
import {Create} from "../common/components";

const ALL_STUDENT_LEVELS: StudentLevel[] = Object.values(StudentLevel);
const LEVEL_CHOICES = [
  {id: "ALL", name: "Tous les niveaux"},
  ...ALL_STUDENT_LEVELS.map((level) => ({id: level, name: level})),
];
type LevelValue = StudentLevel | "ALL";
const validateDateTo = (value: string, allValues: Record<string, unknown>) => {
  if (!value) return "⚠ La date de fin est obligatoire";
  const from = allValues?.date_from as string | undefined;
  if (from && new Date(value) < new Date(from)) {
    return "⚠ La date de fin doit être postérieure à la date de début";
  }

  return undefined;
};

const REQUIRED_INPUT_PROPS = {
  validate: required(),
  fullWidth: true,
};

const REQUIRED_END_DATE_PROPS = {
  validate: [required(), validateDateTo],
  fullWidth: true,
};

const transformRetakeExamSession = (session: RetakeExamSession) => {
  const levels = (session.student_levels || []) as LevelValue[];

  return {
    ...session,
    id: uuid(),
    student_levels: levels.includes("ALL")
      ? ALL_STUDENT_LEVELS
      : (levels as StudentLevel[]),

    date_from:
      session.date_from && toUTC(new Date(session.date_from))?.toISOString(),

    date_to: session.date_to && toUTC(new Date(session.date_to))?.toISOString(),
  };
};
const SelectLevel = () => {
  const {
    field: {value},
  } = useInput({
    source: "student_levels",
    defaultValue: [],
  });

  const handleParse = (newValue: string[]) => {
    const previous = value as LevelValue[];
    const next = newValue as LevelValue[];
    if (next.includes("ALL") && !previous.includes("ALL")) {
      return ["ALL"];
    }
    if (previous.includes("ALL") && next.length > 1) {
      return next.filter((v) => v !== "ALL");
    }
    return next;
  };

  return (
    <SelectArrayInput
      source="student_levels"
      label="Niveaux concernés"
      choices={LEVEL_CHOICES}
      parse={handleParse}
      {...REQUIRED_INPUT_PROPS}
    />
  );
};
export const RetakeExamSessionCreate = (props: Partial<CreateProps>) => (
  <Create
    title="Créer une session de rattrapage"
    transform={transformRetakeExamSession}
    {...props}
  >
    <SimpleForm>
      <TextInput
        source="title"
        label="Nom de la session de rattrapage"
        {...REQUIRED_INPUT_PROPS}
      />
      <DateInput
        source="date_from"
        label="Date de début de la session"
        {...REQUIRED_INPUT_PROPS}
      />
      <DateInput
        source="date_to"
        label="Date de fin de la session"
        {...REQUIRED_END_DATE_PROPS}
      />
      <SelectLevel />
    </SimpleForm>
  </Create>
);
