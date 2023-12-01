import { EmailField, FunctionField, SimpleShowLayout, Show, TextField } from 'react-admin'
import { Link } from '@mui/material'
import authProvider from '../../providers/authProvider'
import { unexpectedValue, CustomDateField } from '../utils'
import { EnableStatus, Sex } from 'haapi-Ts-client'

export const ProfileLayout = () => {
  const emptyText = 'Non défini.e'
  const sexRenderer = user => {
    switch (user.sex) {
      case Sex.M:
        return 'Homme'
      case Sex.F:
        return 'Femme'
      case null:
        return emptyText
      default:
        return unexpectedValue
    }
  }
  const statusRenderer = user => {
    if (user.status === EnableStatus.ENABLED) return 'Actif·ve'
    if (user.status === EnableStatus.SUSPENDED) return 'Suspendu·e'
    if (user.status === EnableStatus.DISABLED) return 'Inactif.ve'
    return unexpectedValue
  }
  const phoneRenderer = data => (data.phone ? <Link href={`tel:${data.phone}`}>{data.phone}</Link> : <span>{emptyText}</span>)
  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={sexRenderer} />
      <FunctionField label='Téléphone' render={phoneRenderer} />
      <CustomDateField source='birth_date' label='Date de naissance' showTime={false} emptyText={emptyText} />
      <TextField source='address' label='Adresse' component='pre' emptyText={emptyText} />
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
