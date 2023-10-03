import { DateInput, TextInput } from 'react-admin'
import { SexRadioButton } from './SexRadioButton'

export const ProfileForm = () => {
  return (
    <>
      <TextInput source='ref' label='Référence' fullWidth required />
      <TextInput source='first_name' label='Prénoms' fullWidth />
      <TextInput source='last_name' label='Nom' fullWidth />
      <SexRadioButton />
      <TextInput source='phone' label='Téléphone' fullWidth required />
      <DateInput source='birth_date' label='Date de naissance' fullWidth required />
      <TextInput source='address' label='Adresse' fullWidth multiline required />
      <TextInput source='email' label='Email' fullWidth required />
      <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth required />
    </>
  )
}
