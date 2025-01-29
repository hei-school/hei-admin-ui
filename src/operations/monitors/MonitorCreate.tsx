import {Create, CreateGeoLocalisation} from "@/operations/common/components";
import {SexRadioButton} from "@/operations/utils";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {toISO} from "@/utils/date";
import {
  AutocompleteArrayInput,
  DateInput,
  maxLength,
  SimpleForm,
  TextInput,
  useGetList,
} from "react-admin";

const transformMonitor = (record: any) => {
  const {
    entrance_datetime,
    coordinates,
    status = "ENABLED",
    ...monitor
  } = record;

  return {
    ...monitor,
    entrance_datetime: toISO(entrance_datetime),
    coordinates: {
      longitude: coordinates?.longitude ? +coordinates.longitude : null,
      latitude: coordinates?.latitude ? +coordinates.latitude : null,
    },
    status,
  };
};

const MonitorCreate = () => {
  return (
    <Create title="Moniteurs" transform={transformMonitor}>
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
        <SelectStudent />
      </SimpleForm>
    </Create>
  );
};

const SelectStudent = () => {
  const {data: students = [], isLoading} = useGetList("students", {
    pagination: {
      page: 1,
      perPage: MAX_ITEM_PER_PAGE,
    },
  });

  return (
    <AutocompleteArrayInput
      fullWidth
      optionText="ref"
      optionValue="ref"
      isLoading={isLoading}
      choices={students}
      label="Etudiants"
      source="student_refs"
    />
  );
};

export default MonitorCreate;
