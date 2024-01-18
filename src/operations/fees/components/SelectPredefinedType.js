import { required, SelectInput, useGetList } from "react-admin"
import { useFormContext, useFormState } from "react-hook-form"
import {FEE_SELECT_STYLE} from "../utils"

export function SelectPredefinedType(props){
  const {data, isLoading} = useGetList("feetypes")
  const {setValue} = useFormContext()
  const state = useFormState()
  
  const updateFeesFields = (event)=>{
    const configId = event.target.value;
    const feeConfig = data.find(el => el.id === configId);
    
    //have to set field one by one cause react hook form doesn't have update many
    setValue("amount", feeConfig.amount)
    setValue("number_of_payments", feeConfig.number_of_payments)
    setValue("comment", feeConfig.name)
    setValue("type", feeConfig.type)
  }

  return(
    <SelectInput
      source="predefined_type"
      label="Type prédéfini"
      optionValue="id"
      optionText="name"
      choices={data || []}
      isLoading={isLoading}
      onChange={updateFeesFields}
      sx={FEE_SELECT_STYLE}
      validate={required()}
      {...props}
    />
  )
}

