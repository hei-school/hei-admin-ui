import { RadioButtonGroupInput } from 'react-admin'
import { manualFeeTypes } from '../../conf'

export function ManualFeeTypeRadioButton(props) {
  return (
    <RadioButtonGroupInput
      {...props}
      source='manual_type'
      label='Type manuel'
      choices={Object.keys(manualFeeTypes).map(id => ({ id: id, name: manualFeeTypes[id].name }))}
    />
  )
}
