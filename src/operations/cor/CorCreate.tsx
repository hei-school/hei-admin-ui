import {Create} from "@/operations/common/components";
import {Cor} from "@haapi-3d601c85/typescript-client";
import {
  CreateProps,
  DateTimeInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import {v4 as uuid} from "uuid";
import {CustomAutocompleteArrayInput} from "./components/CustomAutocompleteArrayInput";
import {StudentAutocompleteInput} from "./components/StudentAutocompleteInput";
import {COR_STATUS_CHOICES} from "./utils/constants";

export const CorCreate = (props: Partial<CreateProps>) => {
  return (
    <Create
      title=" "
      transform={(cor: Cor) => ({
        ...cor,
        id: uuid(),
      })}
      {...props}
    >
      <SimpleForm>
        <TextInput source="description" label="Description" fullWidth />
        <DateTimeInput
          source="interview_date"
          label="Date d'entretien"
          fullWidth
        />
        <SelectInput
          data-testid="cor-status"
          source="status"
          choices={COR_STATUS_CHOICES}
          optionText="name"
          optionValue="id"
          validate={required()}
          fullWidth
        />

        <StudentAutocompleteInput
          label="Référence de l'étudiant"
          source="concerned_student_id"
        />
        <CustomAutocompleteArrayInput
          resource="teachers"
          source="interviewer_ids"
          label=" Prénoms des Intervenants"
        />
      </SimpleForm>
    </Create>
  );
};
