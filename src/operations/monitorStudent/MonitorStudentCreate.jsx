import {DateInput, maxLength, SimpleForm, TextInput} from "react-admin";
import {CreateGeoLocalisation, Create} from "@/operations/common/components";
import {SexRadioButton} from "@/operations/utils";
import {toISO} from "@/utils/date";

const transformStudent = (record) => {
  let {entrance_datetime, longitude, latitude, ...student} = record;
  entrance_datetime = toISO(entrance_datetime);
  const coordinates = {longitude: +longitude, latitude: +latitude};
  return {...student, entrance_datetime, coordinates};
};

const MonitorStudentCreate = () => (
  <Create title="Étudiants" transform={transformStudent}>
    <SimpleForm>
      <TextInput source="ref" label="Référence" fullWidth required />
      <TextInput source="first_name" label="Prénoms" fullWidth required />
      <TextInput source="last_name" label="Nom" fullWidth required />
      <SexRadioButton />
      <TextInput source="phone" label="Téléphone" fullWidth />
      <TextInput
        source="nic"
        label="Numéro CIN"
        fullWidth
        validate={maxLength(
          12,
          "Le numéro CIN ne doit pas dépasser 12 caractères."
        )}
      />
      <CreateGeoLocalisation />
      <TextInput source="birth_place" label="Lieu de naissance" fullWidth />
      <DateInput source="birth_date" label="Date de naissance" fullWidth />
      <TextInput multiline source="address" label="Adresse" fullWidth />
      <TextInput source="email" label="Email" fullWidth required />
      <DateInput
        source="entrance_datetime"
        label="Date d'entrée chez HEI"
        fullWidth
        required
      />
    </SimpleForm>
  </Create>
);

export default MonitorStudentCreate;
