import {Box} from "@mui/material";
import {useState} from "react";
import {
  BooleanInput,
  DateInput,
  maxValue,
  minValue,
  number,
  RadioButtonGroupInput,
  required,
  SelectInput,
  TextInput,
} from "react-admin";
import {useFormContext} from "react-hook-form";
import {
  CATEGORY_CHOICES,
  FEES_FREQUENCY_CHOICES,
  FEESTEMPLATES_CHOICES,
} from "../constants";
import {SelectDueDatetime} from "./SelectDueDatetime";
import {SelectPredefinedType} from "./SelectPredefinedType";

export function FeeInputs() {
  const {reset, getValues} = useFormContext();
  const [feeConfig, setFeeConfig] = useState({
    isPredefinedFee: true,
    isPredefinedDate: true,
  });

  const {isPredefinedDate, isPredefinedFee} = feeConfig;

  const updateFeeConfig = (
    event: React.ChangeEvent<HTMLInputElement>,
    shouldResetField = false
  ) => {
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
          choices={FEESTEMPLATES_CHOICES.slice()}
          readOnly={isPredefinedFee}
          validate={required()}
        />
      ) : (
        <SelectPredefinedType />
      )}
      <Box width="100%">
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <SelectInput
            source="category"
            name="category"
            id="category"
            readOnly={isPredefinedFee}
            label="Catégorie du frais"
            choices={[...CATEGORY_CHOICES]}
            validate={required()}
          />
          <SelectInput
            source="frequency"
            name="frequency"
            id="frequency"
            readOnly={isPredefinedFee}
            label="Frequence du frais"
            choices={[...FEES_FREQUENCY_CHOICES]}
            validate={required()}
          />
        </Box>
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
      </Box>
    </>
  );
}
