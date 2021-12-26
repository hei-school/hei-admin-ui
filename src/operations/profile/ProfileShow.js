import { DateField, EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'

const ProfileShow = props => {
  const withRedWarning = text => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>
  const unexpectedValue = withRedWarning('?')
  const sexRenderer = user => (user.sex === 'M' ? 'Homme' : user.sex === 'F' ? 'Femme' : unexpectedValue)
  const statusRenderer = user => (user.status === 'ENABLED' ? 'Actif·ve' : user.status === 'DISABLED' ? withRedWarning('Suspendu·e') : unexpectedValue)
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source='ref' label='Identifiant étudiant' />
        <TextField source='first_name' label='Prénom(s)' />
        <TextField source='last_name' label='Nom(s)' />
        <FunctionField label='Sexe' render={sexRenderer} />
        <DateField source='birth_date' label='Date de naissance' />
        <TextField source='address' label='Adresse' />
        <TextField source='phone_number' label='Téléphone' />
        <EmailField source='email' label='Email' />
        <DateField source='entrance_date' label="Date d'entrée chez HEI" />
        <FunctionField label='Statut' render={statusRenderer} />
      </SimpleShowLayout>
    </Show>
  )
}

export default ProfileShow
