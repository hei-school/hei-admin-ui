import ProfileShow from './ProfileShow'
import { TextInput } from 'react-admin'
import { FilterForm, TextFilter } from '../../ui/haToolbar'

const profile = {
  show: ProfileShow
}

export default profile

//TODO: delete the profileFilters after changing all list style
export const profileFilters = [
  <TextInput source='first_name' label='Filtre par prénom·s' alwaysOn />,
  <TextInput source='last_name' label='Nom·s' />,
  <TextInput source='ref' label='Référence' />
]

export function ProfileFilters(){
  return (
    <FilterForm>
      <TextFilter label='Référence' source='ref' />
      <TextFilter label='Prénom·s' source='fist_name' />
      <TextFilter label='Nom·s' source='last_name' />
    </FilterForm>
  )
}
