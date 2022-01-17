import {  TextField, TabbedShowLayout, Tab, DateField, Show } from 'react-admin'
const TeacherShow = props => {
  return (
    <Show title='Enseignants' {...props}>
      <TabbedShowLayout>
        <Tab label='Informations personnelles'>
          <TextField source='ref' />
          <TextField source='first_name' label='Prénoms' />
          <TextField source='last_name' label='Noms' />
          <TextField source='sex' label='Sexe' />
          <DateField source='birth_date' label='Date de naissance' />
          <TextField source='address' label='Adresse' />
          <TextField source='email' />
          <DateField source='entrance_datetime' label="Date d'embauche" />
        </Tab>
      </TabbedShowLayout>
    </Show>
  )
}

export default TeacherShow
