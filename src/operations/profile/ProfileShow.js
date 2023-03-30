import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link } from '@mui/material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'

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
  const positionRenderer = user => {
    if (!user.gps_address) {
      return "Pas d'addresse gps"
    }
    if (user.gps_address.latitude === undefined || user.gps_address.longitude === undefined) {
      return 'Valeur Gps manquante'
    }
    if (user.gps_address.latitude !== null && user.gps_address.longitude !== null) {
      return user.gps_address.latitude + ' , ' + user.gps_address.longitude
    }
    return unexpectedValue
  }
  const phoneRenderer = data => <Link href={`tel:${data.phone}`}>{data.phone}</Link>
  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <FunctionField label='Téléphone' render={phoneRenderer} />
      <CustomDateField source='birth_date' label='Date de naissance' showTime={false} />
      <TextField source='address' label='Adresse' component='pre' />
      <FunctionField source='gps_address' label='Adresse Gps' id='location' render={positionRenderer} />
      <EmailField source='email' label='Email' />
      <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" showTime={false} />
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
