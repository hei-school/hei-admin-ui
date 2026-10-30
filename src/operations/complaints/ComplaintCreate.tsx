import {Create} from "@/operations/common/components";
import {
  CreateProps,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import {COMPLAINT_TYPE_CHOICES} from "./utils/constants";

export const ComplaintCreate = (props: Partial<CreateProps>) => (
  <Create title=" " {...props}>
    <SimpleForm>
      <SelectInput
        data-testid="complaint-type"
        source="type"
        label="Type"
        choices={COMPLAINT_TYPE_CHOICES}
        validate={required()}
        fullWidth
      />
      <TextInput source="title" label="Titre" validate={required()} fullWidth />
      <TextInput
        source="description"
        label="Description"
        validate={required()}
        multiline
        rows={4}
        fullWidth
      />
    </SimpleForm>
  </Create>
);
