import { RadioButtonGroupInput } from 'react-admin'

export const StatusRadioButton = props => (
  <RadioButtonGroupInput
    {...props}
    source='status'
    label='Statut'
    choices={[
      { id: 'ENABLED', name: 'Actif·ve' },
      { id: 'DISABLED', name: 'Inactif·ve' }
    ]}
  />
)
