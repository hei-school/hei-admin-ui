import { RadioButtonGroupInput } from 'react-admin'

export const SexRadioButton = () => (
  <RadioButtonGroupInput
    source='sex'
    label='Sexe'
    choices={[
      { id: 'M', name: 'Homme' },
      { id: 'F', name: 'Femme' }
    ]}
  />
)
