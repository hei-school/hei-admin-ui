import ProfileShow from './ProfileShow'
import Person from '@material-ui/icons/Person'
import { ListGuesser, EditGuesser } from 'react-admin'

const profile = {
  list: ListGuesser, //TODO(profile-list): ra-menu only appears for list of resources
  edit: EditGuesser,
  show: ProfileShow,
  icon: Person,
  options: { label: 'Profil' }
}

export default profile
