import { DateInput, NumberInput, TextInput, required } from 'react-admin'

export const Form = ({ edit }) => {
  const validateConditions = [required()]
  return (
    <>
      {edit && <TextInput source='id' label='Identifiant' fullWidth={true} validate={validateConditions} disabled />}
      <TextInput source='title' label='Nom' fullWidth={true} validate={validateConditions} />
      <NumberInput source='coefficient' label='Coefficient' min={1} fullWidth={true} validate={validateConditions} />
      <DateInput source='examination_date' label="Date de l'examen" fullWidth={true} validate={validateConditions} />
    </>
  )
}
