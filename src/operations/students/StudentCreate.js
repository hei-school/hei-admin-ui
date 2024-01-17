import {
  DateInput,
  maxLength,
  SimpleForm,
  TextInput,
} from "react-admin";
import {SexRadioButton} from "../utils";
import {CustomCreate} from "../utils/CustomCreate";
import {SelectSpecialization} from "./components";

const StudentCreate = () => {
  return (
    <CustomCreate
      title="Étudiants"
      resource="students"
    >
      <SimpleForm>
        <TextInput source="ref" label="Référence" fullWidth required />
        <TextInput source="first_name" label="Prénoms" fullWidth required />
        <TextInput source="last_name" label="Nom" fullWidth required />
        <SexRadioButton />
        <TextInput source="phone" label="Téléphone" fullWidth />
        <SelectSpecialization ignoreRole={true} />
        <TextInput
          source="nic"
          label="Numéro CIN"
          fullWidth
          validate={maxLength(
            12,
            "Le numéro CIN ne doit pas dépasser 12 caractères."
          )}
        />
        <TextInput source="birth_place" label="Lieu de naissance" fullWidth />
        <DateInput source="birth_date" label="Date de naissance" fullWidth />
        <TextInput
          source="address"
          label="Adresse"
          fullWidth
          multiline
          data-testid="addressInput"
        />
        <TextInput source="email" label="Email" fullWidth required />
        <DateInput
          source="entrance_datetime"
          label="Date d'entrée chez HEI"
          fullWidth
          required
        />
      </SimpleForm>
    </CustomCreate>
  );
};
export default StudentCreate;
