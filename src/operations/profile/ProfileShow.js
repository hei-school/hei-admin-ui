import { EmailField, FunctionField, Show, SimpleShowLayout, TextField } from 'react-admin'
import { CustomDateField } from '../utils'
import { renderLocation, renderPhone, renderSex, renderStatus } from './utils'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'

export const ProfileLayout = ({ role }) => {
  let isStudent = () => role === WhoamiRoleEnum.Student

  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' id='first_name' label='Prénom(s)' />
      <TextField source='last_name' label='Nom(s)' />
      <FunctionField label='Sexe' render={renderSex} />
      <FunctionField label='Téléphone' render={renderPhone} />
      <CustomDateField source='birth_date' label='Date de naissance' showTime={false} />
      <TextField source='address' label='Adresse' component='pre' />
      <EmailField source='email' label='Email' />
      <CustomDateField source='entrance_datetime' label="Date d'entrée chez HEI" showTime={false} />
      <FunctionField label='Statut' render={renderStatus} />
      {/* check role to avoid breaking _TEACHER_SHOW_ */}
      {isStudent() && <FunctionField render={renderLocation} label='Emplacement' />}
    </SimpleShowLayout>
  )
}

const ProfileShow = () => {
  const { role = WhoamiRoleEnum.Student, id } = authProvider.getCachedWhoami()
  return (
    <Show id={id} resource='profile' basePath='/profile' title='Mon profil'>
      <ProfileLayout role={role} />
    </Show>
  )
}

export default ProfileShow
