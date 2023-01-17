import { RadioButtonGroupInput } from 'react-admin'
import { UserSexEnum } from '../../gen/haClient'

const sexChoices = [
  { id: UserSexEnum.M, name: 'Homme' },
  { id: UserSexEnum.F, name: 'Femme' }
]
const SexRadioButton = () => <RadioButtonGroupInput source='sex' label='Sexe' choices={sexChoices} />

export default SexRadioButton
