import {Create} from "@/operations/common/components";
import {Cor} from "@haapi-b0fc7615/typescript-client";
import {CreateProps, DateTimeInput, SimpleForm, TextInput} from "react-admin";
import {v4 as uuid} from "uuid";
import {StudentAutocompleteInput} from "./StudentAutocompleteInput";

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
        <StudentAutocompleteInput source="concerned_student_id" />
      </SimpleForm>
    </Create>
  );
};
