import ProfileShow from './ProfileShow'
import ProfileEdit from './ProfileEdit'
import { TextInput } from 'react-admin'

const profile = {
  show: ProfileShow,
  edit: props => <ProfileEdit {...props} title='Profil' />
}

export default profile

export const profileFilters = [
  <TextInput source='first_name' label='Filtre par prénom·s' alwaysOn />,
  <TextInput source='last_name' label='Nom·s' />,
  <TextInput source='ref' label='Référence' />
]
