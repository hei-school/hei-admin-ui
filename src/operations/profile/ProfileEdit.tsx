import {FC} from "react";
import {DateInput, SimpleForm, TextInput, maxLength} from "react-admin";
import {EditToolBar, SexRadioButton} from "../utils";
import {StatusRadioButton} from "../utils/UserStatusRadioButton";
import {SelectSpecialization} from "../students/components";
import {EditGeoLocalisation, Edit} from "../common/components";
import {User} from "@/providers/types";
import {StaffMember, Student} from "@haapi/typescript-client";
import {useRole} from "../../security/hooks";
import {toUTC} from "../../utils/date";

const userToUserApi = ({
  birth_date,
  entrance_datetime,
  ending_service,
  coordinates = {},
  ...data
}: User & Required<Student>["coordinates"] & Required<StaffMember>) => {
  const {latitude, longitude} = coordinates;
  return {
    ...data,
    birth_date: toUTC(new Date(birth_date!)).toISOString(),
    entrance_datetime: toUTC(new Date(entrance_datetime!)).toISOString(),
    ending_service: ending_service
      ? toUTC(new Date(ending_service!)).toISOString()
      : null,
    coordinates: {latitude: +latitude!, longitude: +longitude!},
  };
};

const ProfileEdit: FC<{
  isOwnProfile: boolean;
  isStudent: boolean;
  isStaff: boolean;
}> = ({isOwnProfile, isStudent, isStaff = false}) => {
  const role = useRole();
  const isStudentProfile = isStudent || role.isStudent();
  const isStaffProfil = isStaff || role.isStaffMember();

  return (
    <Edit
      title="Modifier le profil"
      transform={userToUserApi}
      queryOptions={{
        meta: {
          meta: {
            isUpdate: true,
          },
        },
      }}
    >
      <SimpleForm toolbar={<EditToolBar />}>
        <TextInput source="ref" label="Référence" fullWidth readOnly />
        <TextInput source="first_name" label="Prénom·s" fullWidth />
        <TextInput source="last_name" label="Nom·s" fullWidth />
        {isStudentProfile && <SelectSpecialization readOnly={isOwnProfile} />}
        <TextInput source="email" fullWidth readOnly />
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
        {isStaffProfil && (
          <>
            <TextInput source="cnaps" label="Cnaps" fullWidth />
            <TextInput source="ostie" label="Ostie" fullWidth />
            <TextInput source="function" label="Poste chez HEI" fullWidth />
            <TextInput source="degree" label="Diplôme" fullWidth />
            <DateInput
              source="ending_service"
              label="Fin de service"
              fullWidth
              readOnly={isOwnProfile}
            />
          </>
        )}
        <StatusRadioButton readOnly={isOwnProfile} />
      </SimpleForm>
    </Edit>
  );
};

export default ProfileEdit;
