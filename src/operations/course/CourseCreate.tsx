import {Create} from "@/operations/common/components";
import {Course} from "@haapi/typescript-client";
import {
  CreateProps,
  SimpleForm,
  TextInput,
  minValue,
  number,
  required,
} from "react-admin";
import {v4 as uuid} from "uuid";

export function CourseCreate(props: Partial<CreateProps>) {
  return (
    <Create
      title=" "
      transform={(course: Course): Course => ({
        ...course,
        id: uuid(),
        total_hours: course.total_hours ? +course.total_hours : 1,
        credits: +course.credits!,
      })}
      {...props}
    >
      <SimpleForm>
        <TextInput source="code" label="Code" validate={required()} fullWidth />
        <TextInput source="name" label="Nom" validate={required()} fullWidth />
        <TextInput
          source="credits"
          label="Crédits"
          validate={[required(), number(), minValue(1)]}
          fullWidth
        />
        <TextInput
          source="total_hours"
          label="Heure total"
          validate={[number(), minValue(1)]}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
}
