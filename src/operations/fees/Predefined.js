import { SelectInput } from "react-admin"
import { predefinedFeeTypes, predefinedFirstDueDates } from "../../conf"
import { commonStyleSelect } from "./utils"

export function PredefinedFeeTypeRadioButton({ setFeesConf, ...props }){
  return (
    <SelectInput
      {...props}
      source='predefined_type'
      label='Type prédéfini'
      choices={Object.keys(predefinedFeeTypes).map(id => ({ id: id, name: predefinedFeeTypes[id][0].name }))}
      onChange={({ target: { value } }) => setFeesConf(predefinedFeeTypes[value])}
      sx={commonStyleSelect}
    />
  )
}

export function PredefinedFirstDueDateRadioButton(props){
  return (
    <SelectInput
      {...props}
      source='predefined_first_dueDate'
      label='Première date limite prédéfinie'
      choices={Object.keys(predefinedFirstDueDates).map(id => ({ id: id, name: predefinedFirstDueDates[id].name }))}
      sx={commonStyleSelect}
    />
  )
}
