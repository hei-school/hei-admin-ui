import {useState} from "react";
import {
  BooleanInput,
  RadioButtonGroupInput,
  TextInput,
  DateInput,
  maxValue,
  minValue,
  number,
  required,
} from "react-admin";
import {useFormContext} from "react-hook-form";
import {SelectDueDatetime} from "./SelectDueDatetime";
import {SelectPredefinedType} from "./SelectPredefinedType";
import {FEESTEMPLATES_CHOICES} from "../constants";

export function FeeInputs() {
  const {reset, getValues} = useFormContext();
  const [feeConfig, setFeeConfig] = useState({
    isPredefinedFee: true,
    isPredefinedDate: true,
  });

  const {isPredefinedDate, isPredefinedFee} = feeConfig;

  const updateFeeConfig = (event, shouldResetField = false) => {
    const {name, checked} = event.target;
    setFeeConfig({...feeConfig, [name]: checked});
    if (shouldResetField) {
      reset({
        ...getValues(),
        [name]: checked,
        predefinedType: "",
        amount: "",
        comment: "",
        number_of_payments: "",
      });
    }
  };

  return (
    <>
      <BooleanInput
        id="isPredefinedFee"
        label="Type prédéfini ?"
        data-testid="isPredefinedFee"
        name="isPredefinedFee"
        source="isPredefinedFee"
        onChange={(event) => updateFeeConfig(event, true)}
        defaultValue={true}
      />
      {!isPredefinedFee ? (
        <RadioButtonGroupInput
          source="type"
          name="type"
          label="Type manuel"
          data-testid="type"
          optionText="label"
          optionValue="value"
          choices={FEESTEMPLATES_CHOICES}
          readOnly={isPredefinedFee}
          validate={required()}
        />
      ) : (
        <SelectPredefinedType />
      )}
      <div>
        <TextInput
          fullWidth
          source="amount"
          id="amount"
          name="amount"
          inputProps={{
            "data-testid": "amount",
          }}
          label="Montant de la mensualité"
          readOnly={isPredefinedFee}
          validate={[required(), number(), minValue(1)]}
        />
        <TextInput
          fullWidth
          source="number_of_payments"
          id="number_of_payments"
          name="number_of_payments"
          inputProps={{
            "data-testid": "number_of_payments",
          }}
          label="Nombre de mensualités"
          readOnly={isPredefinedFee}
          validate={[required(), number(), minValue(1), maxValue(12)]}
        />
        <TextInput
          fullWidth
          source="comment"
          name="comment"
          id="comment"
          label="Commentaire"
          readOnly={isPredefinedFee}
          inputProps={{
            "data-testid": "comment",
          }}
        />
        <BooleanInput
          label="Date limite à chaque fin du mois ?"
          source="isPredefinedDate"
          id="isPredefinedDate"
          name="isPredefinedDate"
          data-testid="isPredefinedDate"
          defaultValue={true}
          onChange={updateFeeConfig}
        />
        {isPredefinedDate ? (
          <SelectDueDatetime />
        ) : (
          <DateInput
            fullWidth
            source="due_datetime"
            id="due_datetime"
            name="due_datetime"
            data-testid="due_datetime"
            label="Première date limite manuelle"
            validate={required()}
          />
        )}
      </div>
    </>
  );
}
