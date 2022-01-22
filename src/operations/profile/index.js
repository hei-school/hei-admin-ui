import ProfileShow from './ProfileShow'
import { TextInput } from 'react-admin'

const profile = {
  show: props => <ProfileShow withChangeRequest={true} {...props} />
}

export default profile

export const profileFilters = [
  <TextInput label='Filtre par prénom' source='first_name' alwaysOn />,
  <TextInput label='Nom' source='last_name' />,
  <TextInput label='Référence' source='ref' />
]
