import ProfileShow from './ProfileShow'
import { TextInput } from 'react-admin'
import { FilterForm, TextFilter } from '../../ui/haToolbar'

const profile = {
  show: ProfileShow
}

export default profile

export function ProfileFilters(){
  return (
    <FilterForm>
      <TextFilter label='Référence' source='ref' />
      <TextFilter label='Prénom·s' source='first_name' />
      <TextFilter label='Nom·s' source='last_name' />
    </FilterForm>
  )
}
