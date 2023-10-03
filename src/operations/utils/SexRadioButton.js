import { RadioButtonGroupInput } from 'react-admin'

export const SexRadioButton = () => (
  <RadioButtonGroupInput
    required
    source='sex'
    label='Sexe'
    choices={[
      { id: 'M', name: 'Homme' },
      { id: 'F', name: 'Femme' }
    ]}
  />
)
