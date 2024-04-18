import {DateInput, maxLength, SimpleForm, TextInput} from "react-admin";
import {EditToolBar, SexRadioButton} from "../utils";
import {toUTC} from "../../utils/date";
import {StatusRadioButton} from "../utils/UserStatusRadioButton";
import {SelectSpecialization} from "../students/components";
import {useRole} from "../../security/hooks";
import {EditGeoLocalisation, Edit} from "../common/components";

const userToUserApi = ({
  birth_date,
  entrance_datetime,
  longitude,
  latitude,
  ...data
}) => ({
  ...data,
  birth_date: toUTC(new Date(birth_date)).toISOString(),
  entrance_datetime: toUTC(new Date(entrance_datetime)).toISOString(),
  coordinates: {latitude: +latitude, longitude: +longitude},
});

const ProfileEdit = ({isOwnProfile, isStudent}) => {
  const role = useRole();
  const isStudentProfile = isStudent || role.isStudent();

  return (
    <Edit
      title="Modifier le profil"
      transform={userToUserApi}
      queryOptions={{meta: {isUpdate: true}}}
    >
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput source="ref" label="Référence" fullWidth readOnly />
        <TextInput source="first_name" label="Prénom·s" fullWidth />
        <TextInput source="last_name" label="Nom·s" fullWidth />
        {isStudentProfile && <SelectSpecialization readOnly={isOwnProfile} />}
        <TextInput source="email" fullWidth readOnly={isOwnProfile} />
        <TextInput multiline source="address" label="Adresse" fullWidth />
        <EditGeoLocalisation />
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
        <TextInput source="birth_place" label="Lieu de naissance" fullWidth />
        <DateInput source="birth_date" label="Date de naissance" fullWidth />
        <DateInput
          source="entrance_datetime"
          label="Date d'entrée chez HEI"
          fullWidth
          readOnly={isOwnProfile}
        />
        <StatusRadioButton readOnly={isOwnProfile} />
      </SimpleForm>
    </Edit>
  );
};

export default ProfileEdit;
