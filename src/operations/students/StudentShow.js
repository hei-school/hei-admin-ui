import { FunctionField, TextField, Show, TabbedShowLayout, Tab, DateField } from 'react-admin'

const StudentShow = props => {
  const statusRenderer = user => (user.status === 'ENABLED' ? 'Actif·ve' : user.status === 'DISABLED' ? withRedWarning('Suspendu·e') : unexpectedValue)
  const withRedWarning = text => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>
  const unexpectedValue = withRedWarning('?')
  return (
    <Show title='Etudiants' {...props}>
      <TabbedShowLayout>
        <Tab label='Informations personnelles'>
          <TextField source='first_name' label='Prénoms' />
          <TextField source='last_name' label='Nom' />
          <TextField source='sex' label='Sexe' />
          <DateField source='birth_date' label='Date de naissance' />
          <TextField source='address' label='Adresse' />
          <TextField source='email' label='email' />
        </Tab>
        <Tab label='Informations internes'>
          <TextField source='ref' label='Référence Etudiant' />
          <FunctionField source='status' render={statusRenderer} />
        </Tab>
      </TabbedShowLayout>
    </Show>
  )
}

export default StudentShow
