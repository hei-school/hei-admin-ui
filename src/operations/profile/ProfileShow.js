import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { CustomDateField } from '../fees/ByStatusFeeList'
import authProvider from '../../providers/authProvider'

import { unexpectedValue } from '../utils/typography'

export const ProfileLayout = () => {
  const sexRenderer = user => {
    if (user.sex === 'M') return 'Homme'
    if (user.sex === 'F') return 'Femme'
    return unexpectedValue
  }
  const statusRenderer = user => {
    if (user.status === 'ENABLED') return 'Actif·ve'
    if (user.status === 'DISABLED') return 'Suspendu·e'
    return unexpectedValue
  }
  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <TextField label='Téléphone' source='phone' />
      <CustomDateField label='Date de naissance' source='birth_date' />
      <TextField source='address' label='Adresse' component='pre' />
      <EmailField source='email' label='Email' />
      <CustomDateField label="Date d'entrée chez HEI" source='entrance_datetime' />
      <FunctionField label='Statut' render={statusRenderer} />
    </SimpleShowLayout>
  )
}

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id
  return (
    <Show id={id} resource='profile' basePath='/profile' title='Mon profil'>
      <ProfileLayout />
    </Show>
  )
}

export default ProfileShow
