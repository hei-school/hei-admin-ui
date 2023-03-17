import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link } from '@mui/material'
import { CustomDateField } from '../fees/ByStatusFeeList'
import authProvider from '../../providers/authProvider'
import { unexpectedValue } from '../utils'

export const ProfileLayout = props => {
  const { role } = props
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
  const studentComponent = () => {
    return (
      <>
        <TextField source='latitude' label='Latitude' />
        <TextField source='longitude' label='Longitude' />
        <TextField source='atltitude' label='Altitude' />
        <TextField source='accuracy' label='accuracy' />
        <TextField source='altitudeAccuracy' label='Altitude accuracy' />
        <TextField source='heading' label='Heading' />
        <TextField source='speed' label='Speed' />
      </>
    )
  }
  const phoneRenderer = data => <Link href={`tel:${data.phone}`}>{data.phone}</Link>
  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <FunctionField label='Téléphone' render={phoneRenderer} />
      <CustomDateField source='birth_date' label='Date de naissance' />
      <TextField source='address' label='Adresse' component='pre' />
      <EmailField source='email' label='Email' />
      {role == 'STUDENT' ? studentComponent : ''}
      <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" />
      <FunctionField label='Statut' render={statusRenderer} />
    </SimpleShowLayout>
  )
}

const ProfileShow = () => {
  const id = authProvider.getCachedWhoami().id
  const role = authProvider.getCachedWhoami().role
  return (
    <Show id={id} resource='profile' basePath='/profile' title='Mon profil'>
      <ProfileLayout role={role} />
    </Show>
  )
}

export default ProfileShow
