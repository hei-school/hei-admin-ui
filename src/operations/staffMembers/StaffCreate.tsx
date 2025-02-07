import {toISO} from "@/utils/date";
import {StaffMember} from "@haapi/typescript-client";
import {Box} from "@mui/material";
import {DateInput, maxLength, SimpleForm, TextInput} from "react-admin";
import {Create, CreateGeoLocalisation} from "../common/components";
import {SexRadioButton} from "../utils";

const transformStaff = (staff: StaffMember) => {
  const {entrance_datetime, ending_service, coordinates, ...restStaff} = staff;

  return {
    ...restStaff,
    ending_service: ending_service ? toISO(ending_service) : null,
    status: "ENABLED",
    entrance_datetime: toISO(entrance_datetime),
    coordinates: {
      longitude: coordinates?.longitude ? +coordinates.longitude : null,
      latitude: coordinates?.latitude ? +coordinates.latitude : null,
    },
  };
};

export const StaffCreate = () => {
  return (
    <Create title="Membres Staff" transform={transformStaff}>
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
        <TextInput source="cnaps" label="Cnaps" fullWidth />
        <TextInput source="ostie" label="Ostie" fullWidth />
        <Box display="flex" flexDirection="row" width="100%" gap="2vw">
          <DateInput
            source="entrance_datetime"
            label="Date d'entrée chez HEI"
            fullWidth
            required
          />
          <DateInput source="ending_service" label="Fin de service" fullWidth />
        </Box>
        <TextInput source="function" label="Poste chez HEI" fullWidth />
        <TextInput source="degree" label="Diplôme" fullWidth />
      </SimpleForm>
    </Create>
  );
};
