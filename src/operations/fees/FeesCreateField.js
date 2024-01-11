import {BooleanInput, DateInput, required} from "react-admin";
import {FeesConfInput} from "./FeesCreate";
import {ManualFeeTypeRadioButton} from "./ManualField";
import {
  PredefinedFeeTypeRadioButton,
  PredefinedFirstDueDateRadioButton,
} from "./PredefinedField";
import {defaultIsPredefinedType} from "./utils";

export const FeesCreateField = (props) => {
  const {feesConf, setFeesConf, createFeesConf} = props;
  const {
    isPredefinedType,
    isPredefinedDueDate,
    setIsPredefinedType,
    setIsPredefinedDueDate,
  } = createFeesConf;

  return (
    <>
      <BooleanInput
        source="is_predefined_type"
        label="Type prédéfini ?"
        name="is_predefined_type"
        defaultValue={defaultIsPredefinedType}
        onChange={({target: {checked}}) => setIsPredefinedType(checked)}
      />
      {isPredefinedType ? (
        <PredefinedFeeTypeRadioButton
          setFeesConf={setFeesConf}
          validate={required()}
        />
      ) : (
        <ManualFeeTypeRadioButton validate={required()} />
      )}
      <FeesConfInput isPredefinedType={isPredefinedType} feesConf={feesConf} />
      <BooleanInput
        source="is_predefined_first_dueDate"
        label="Première date limite prédéfinie ?"
        name="is_predefined_first_dueDate"
        defaultValue={true}
        fullWidth
        onChange={({target: {checked}}) => setIsPredefinedDueDate(checked)}
      />
      {isPredefinedDueDate ? (
        <PredefinedFirstDueDateRadioButton
          createFeesConf={createFeesConf}
          validate={required()}
        />
      ) : (
        <DateInput
          source="manual_first_duedate"
          name="manual_first_duedate"
          label="Première date limite manuelle"
          fullWidth
          validate={required()}
        />
      )}
    </>
  );
};
