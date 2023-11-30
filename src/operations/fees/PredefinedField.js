import { required, SelectInput } from "react-admin"
import { Box } from '@mui/material'
import { predefinedFeeTypes, predefinedFirstDueDates } from "../../conf"
import { commonStyleSelect, DateValueInput } from "./utils"
import { useState } from "react"

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

export function PredefinedFirstDueDateRadioButton({createFeesConf, ...props}){
  const [ isLastDay, setIsLastDay ] = useState(false)
  const { firstDate, setFirstDate } = createFeesConf
  const showFirstDateInput = ({target})=> setIsLastDay(target.value === 'date3')
  const updateFirstDate = ({target})=>setFirstDate({...firstDate, [target.name]: target.value})

  return (
    <Box sx={{display:'flex', alignItems:'start', gap: 1 }}>
      <SelectInput
        {...props}
        source='predefined_first_dueDate'
        name='predefined_first_dueDate'
        validate={[required(), ]}
        label='Première date limite prédéfinie'
        choices={Object.keys(predefinedFirstDueDates).map(id => ({ id: id, name: predefinedFirstDueDates[id].name }))}
        onChange={showFirstDateInput}
        sx={commonStyleSelect}
      />
      { isLastDay && <DateValueInput dateValue={firstDate} onChange={updateFirstDate} /> }
    </Box>
  )
}
