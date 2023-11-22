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
      <TextFilter data-testid='filter-profile-last_name' label='Nom·s' source='last_name' />
      <TextFilter data-testid='filter-profile-first_name'  label='Prénom·s' source='first_name' />
      <TextFilter data-testid='filter-profile-ref' label='Référence' source='ref' />
    </FilterForm>
  )
}
