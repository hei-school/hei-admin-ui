import {
    BooleanInput,
  DateInput,
  maxLength,
  SimpleForm,
  TextInput,
} from "react-admin";
import {SexRadioButton, turnStringIntoDate} from "../utils";
import {CustomCreate} from "../utils/CustomCreate";
import {FeeFields} from "../fees/components";
import {SelectSpecialization} from "./components";
import { useState } from "react";
import { createStudentApi } from "./utils/createStudentApi";

const StudentCreate = () => {
  const [canCreateFees, setCanCreateFees] = useState(false)
  return (
    <CustomCreate
      title="Étudiants"
      resource="students"
      transform={createStudentApi}
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
        <BooleanInput
          label="Activer la création des frais"
          name="canCreateFees"
          source="canCreateFees"
          defaultValue={false}
          onChange={() => setCanCreateFees(prev => !prev)}
        />
        {canCreateFees && <FeeFields />}
      </SimpleForm>
    </CustomCreate>
  );
};
export default StudentCreate;
