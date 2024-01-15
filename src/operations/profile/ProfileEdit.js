import {DateInput, maxLength, SimpleForm, TextInput} from "react-admin";
import {EditToolBar, SexRadioButton, toUTC} from "../utils";
import {StatusRadioButton} from "../utils/UserStatusRadioButton";
import {CustomEdit} from "../utils/CustomEdit";
import {SelectSpecialization} from "../students/components";
import {useRole} from "../../security/hooks";

const usertoUserApi = ({birth_date, entrance_datetime, ...data}) => ({
  ...data,
  birth_date: toUTC(new Date(birth_date)).toISOString(),
  entrance_datetime: toUTC(new Date(entrance_datetime)).toISOString(),
});

const ProfileEdit = ({isOwnProfile, isStudent}) => {
  const role = useRole();

  return (
    <CustomEdit title="Modifier le profil" transform={usertoUserApi}>
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput source="ref" label="Référence" fullWidth disabled={true} />
        <TextInput source="first_name" label="Prénom·s" fullWidth />
        <TextInput source="last_name" label="Nom·s" fullWidth />
        {(isStudent || role.isStudent()) && (
          <SelectSpecialization disabled={isOwnProfile} />
        )}
        <TextInput source="email" fullWidth disabled={isOwnProfile} />
        <TextInput multiline source="address" label="Adresse" fullWidth />
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
          disabled={isOwnProfile}
        />
        <StatusRadioButton disabled={isOwnProfile} />
      </SimpleForm>
    </CustomEdit>
  );
};

export default ProfileEdit;
