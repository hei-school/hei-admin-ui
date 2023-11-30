import ProfileShow from './ProfileShow'
import { FilterForm, SelectInputFilter, TextFilter } from '../../ui/haToolbar'
import { EnableStatus } from 'haapi-Ts-client'

const profile = {
  show: ProfileShow
}

export default profile

export function ProfileFilters() {
  return (
    <FilterForm>
      <TextFilter data-testid='filter-profile-last_name' label='Nom·s' source='last_name' />
      <TextFilter data-testid='filter-profile-first_name' label='Prénom·s' source='first_name' />
      <TextFilter data-testid='filter-profile-ref' label='Référence' source='ref' />
      <SelectInputFilter
        data-testid='filter-profile-status'
        label='Statut'
        source='status'
        choices={[
          { id: EnableStatus.ENABLED, name: 'Actif.ve' },
          { id: EnableStatus.DISABLED, name: 'Inactif.ve' },
          { id: null, name: 'Aucune valeur' }
        ]}
      />
    </FilterForm>
  )
}
