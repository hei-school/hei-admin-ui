import {useState} from "react";
import {
  BooleanInput,
  RadioButtonGroupInput,
  TextInput,
  maxValue,
  minValue,
  number,
  required,
  DateInput,
} from "react-admin";
import {SelectDueDatetime} from "./SelectDueDatetime";
import {SelectPredefinedType} from "./SelectPredefinedType";
import {FEESTEMPLATES_CHOICES} from "../feesTemplatesChoices";
import {useFormContext} from "react-hook-form";

export function FeeFields() {
  const {reset} = useFormContext();
  const [feeConfig, setFeeConfig] = useState({
    isPredefinedFee: true,
    isPredefinedDate: true,
  });

  const {isPredefinedDate, isPredefinedFee} = feeConfig;

  const updateFeeConfig = (event, shouldResetField = false) => {
    const {name, checked} = event.target;
    setFeeConfig({...feeConfig, [name]: checked});

    if (shouldResetField) {
      reset(
        {
          [name]: checked,
          predefinedType: "",
        },
        {keepDefaultValues: true}
      );
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
          disabled={isPredefinedFee}
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
          data-testid="amount"
          label="Montant de la mensualité"
          disabled={isPredefinedFee}
          validate={[required(), number(), minValue(1)]}
        />
        <TextInput
          fullWidth
          source="number_of_payments"
          id="number_of_payments"
          name="number_of_payments"
          data-testid="number_of_payments"
          label="Nombre de mensualités"
          disabled={isPredefinedFee}
          validate={[required(), number(), minValue(1), maxValue(12)]}
        />
        <TextInput
          fullWidth
          source="comment"
          name="comment"
          id="comment"
          data-testid="comment"
          label="Commentaire"
          disabled={isPredefinedFee}
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
