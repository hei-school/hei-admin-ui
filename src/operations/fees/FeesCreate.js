import { useState, useEffect } from 'react'

import {
  BooleanInput,
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  RadioButtonGroupInput,
  useDataProvider,
  required,
  minValue,
  maxValue,
  number
} from 'react-admin'

const PredefinedFeeTypeRadioButton = props => (
  <RadioButtonGroupInput
    {...props}
    source='predefined_type'
    label='Type prédéfini'
    choices={[
      { id: 'ANNUAL_TUITION_1X', name: 'Écolage annuel 1x' },
      { id: 'ANNUAL_TUITION_8X', name: 'Écolage annuel 8x' },
      { id: 'ANNUAL_TUITION_9X', name: 'Écolage annuel 9x' },
      { id: 'BIANNUAL_TUITION_1x', name: 'Écolage semestriel 1x' },
      { id: 'BIANNUAL_TUITION_4x', name: 'Écolage semestriel 4x' },
      { id: 'HARDWARE_CONF1_8x', name: 'Matériel conf1 8x' },
      { id: 'HARDWARE_CONF2_8x', name: 'Matériel conf2 8x' },
      { id: 'ENTRANCE_EXAM', name: 'Concours' },
      { id: 'KNOWLEDGE_VALIDATION', name: 'Validation des acquis' }
    ]}
  />
)

const ManualFeeTypeRadioButton = props => (
  <RadioButtonGroupInput
    {...props}
    source='manual_type'
    label='Type manuel'
    choices={[
      { id: 'TUITION', name: 'Écolage' },
      { id: 'HARDWARE', name: 'Matériel' }
    ]}
  />
)

const PredefinedCreationDateRadioButton = props => (
  <RadioButtonGroupInput
    {...props}
    source='type'
    label='Date de création prédéfinie'
    choices={[
      { id: 'OCT21', name: '15 octobre 2021' },
      { id: 'JAN22', name: '15 janvier 2022' },
      { id: 'APR22', name: '15 avril 2022' }
    ]}
  />
)

const FeesCreate = props => {
  const studentId = props.match.params.studentId
  const [studentRef, setStudentRef] = useState()
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
  })

  const defaultIsPredefinedType = true
  const [isPredefinedType, setIsPredefinedType] = useState(defaultIsPredefinedType)

  const defaultIsPredefinedCreationDate = true
  const [isPredefinedCreationDate, setIsPredefinedCreationDate] = useState(defaultIsPredefinedCreationDate)

  const validateMonthlyAmount = [required(), number(), minValue(1)]
  const validateMonthsNumber = [required(), number(), minValue(1), maxValue(12)]
  return (
    <Create {...props} title={`Frais de ${studentRef}`} resource='fees' basePath={`/students/${studentId}/fees`}>
      <SimpleForm>
        <BooleanInput
          source='is_predefined_type'
          label='Type prédéfini ?'
          defaultValue={defaultIsPredefinedType}
          fullWidth={true}
          onChange={value => setIsPredefinedType(value)}
        />
        {isPredefinedType ? <PredefinedFeeTypeRadioButton validate={required()} /> : <ManualFeeTypeRadioButton validate={required()} />}

        <TextInput source='monthly_amount' label='Montant de la mensualité' fullWidth={true} disabled={isPredefinedType} validate={validateMonthlyAmount} />
        <TextInput source='months_number' label='Nombre de mensualités' fullWidth={true} disabled={isPredefinedType} validate={validateMonthsNumber} />
        <TextInput source='comment' label='Commentaire' fullWidth={true} disabled={isPredefinedType} validate={required()} />

        <BooleanInput
          source='is_predefined_creation_date'
          label='Date de création prédéfinie ?'
          defaultValue={defaultIsPredefinedCreationDate}
          fullWidth={true}
          onChange={value => setIsPredefinedCreationDate(value)}
        />
        {isPredefinedCreationDate ? (
          <PredefinedCreationDateRadioButton validate={required()} />
        ) : (
          <DateInput source='creation_date' label='Date de création manuelle' fullWidth={true} disabled={isPredefinedCreationDate} validate={required()} />
        )}
      </SimpleForm>
    </Create>
  )
}

export default FeesCreate
