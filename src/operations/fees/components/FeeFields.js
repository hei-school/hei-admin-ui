import { useState } from "react";
import { BooleanInput, RadioButtonGroupInput, TextInput, maxValue, minValue, number, required, DateInput} from "react-admin";
import { SelectDueDatetime } from "./SelectDueDatetime";
import { SelectPredefinedType } from "./SelectPredefinedType";
import { FEETYPE_CHOICES } from "../utils";

export function FeeFields(){
  const [feeConfig, setFeeConfig]= useState({
    isPredefinedFee: true,
    isPredefinedDate: true
  })
  const validateAmount = [required(), number(), minValue(1)];
  const validateMonthsNumber = [required(),number(),minValue(1),maxValue(12)];
  const {isPredefinedDate, isPredefinedFee} = feeConfig;

  const udpateFeeConfig = (event)=>{
    const {name, checked} = event.target;
    setFeeConfig({...feeConfig, [name]: checked})
  }

  return (
    <>
      <BooleanInput
        label="Type prédéfini ?"
        name="isPredefinedFee"
        source="isPredefinedFee"
        defaultValue={true}
        onChange={udpateFeeConfig}
      />
      {
        !isPredefinedFee ? 
        (
          <RadioButtonGroupInput
            source="type"
            name="type"
            label="Type manuel"
            optionText="label"
            optionValue="value"
            choices={FEETYPE_CHOICES}
            disabled={isPredefinedFee}
            validate={required()}
          />
        ): <SelectPredefinedType /> 
      }
      <div>
        <TextInput
          fullWidth
          source="amount"
          name="amount"
          label="Montant de la mensualité"
          disabled={isPredefinedFee}
          validate={validateAmount}
        />
        <TextInput
          fullWidth
          source="number_of_payments"
          name="number_of_payments"
          label="Nombre de mensualités"
          disabled={isPredefinedFee}
          validate={validateMonthsNumber}
        />
        <TextInput
          fullWidth
          source="comment"
          name="comment"
          label="Commentaire"
          disabled={isPredefinedFee}
        />
        <BooleanInput
          label="Date limite à chaque fin du mois ?"
          source="isPredefinedDate"
          name="isPredefinedDate"
          defaultValue={true}
          onChange={udpateFeeConfig}
        />
        {
          isPredefinedDate ? <SelectDueDatetime /> : (
            <DateInput
              fullWidth
              source="due_datetime"
              name="due_datetime"
              label="Première date limite manuelle"
              validate={required()}
            />
          )
        }
      </div>
    </>
  );
}
