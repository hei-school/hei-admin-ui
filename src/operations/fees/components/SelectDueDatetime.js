import {Box} from "@mui/material"
import { SelectInput, TextInput, minValue, required, number } from "react-admin"

//to list all months
const MONTHS_LISTS = Array.from({length: 12}, (_, month) =>{
  return new Intl.DateTimeFormat("fr-FR", {month: "long"}).format(
    new Date(2023, month, 1)
  )
});

const MONTHS_CHOICES = MONTHS_LISTS.map((month, index)=> {
  return {
    label: month[0].toUpperCase() + month.slice(1),
    value: index
  }
})

export function SelectDueDatetime(){
  const validateYear = [
    required(), 
    number(), 
    minValue(2021)
  ]

  return(
   <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
      <SelectInput
        label="Premier mois"
        name="predefinedMonth"
        source="predefinedMonth"
        optionText="label"
        optionValue="value"
        choices={MONTHS_CHOICES}
        validate={required()}
        sx={{flex: 2}}
      />
      <TextInput
        label="Année"
        source="predefinedYear"
        name="predefinedYear"
        validate={validateYear}
        sx={{flex: 1}}
      />
    </Box>
  )
}
