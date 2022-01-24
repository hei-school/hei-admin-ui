import React from 'react'
import { Create, SimpleForm, TextInput, DateTimeInput, DateInput } from 'react-admin'

const TeacherCreate = props => (
  <Create {...props} title='Enseignants'>
    <SimpleForm>
      <TextInput source='ref' label='Référence' />
      <TextInput source='first_name' label='Prénoms' />
      <TextInput source='last_name' label='Nom' />
      <TextInput source='sex' label='Sexe' />
      <TextInput source='phone' label='Téléphone' />
      <DateInput source='birth_date' label='Date de naissance' />
      <TextInput source='address' label='Adresse' />
      <TextInput source='email' label='Email' />
      <DateTimeInput source='entrance_datetime' label="Date d'entrée chez HEI" />
    </SimpleForm>
  </Create>
)
export default TeacherCreate
