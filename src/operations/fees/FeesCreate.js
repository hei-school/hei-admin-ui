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
import { useForm } from 'react-final-form'
import { currentYear, manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from './conf'

const PredefinedFeeTypeRadioButton = ({ setFeesConf, ...props }) => (
  <RadioButtonGroupInput
    {...props}
    source='predefined_type'
    label='Type prédéfini'
    choices={Object.keys(predefinedFeeTypes).map(id => ({ id: id, name: predefinedFeeTypes[id].name }))}
    onChange={id => setFeesConf(predefinedFeeTypes[id])}
  />
)

const ManualFeeTypeRadioButton = props => (
  <RadioButtonGroupInput
    {...props}
    source='manual_type'
    label='Type manuel'
    choices={Object.keys(manualFeeTypes).map(id => ({ id: id, name: manualFeeTypes[id].name }))}
  />
)

const PredefinedFirstDueDateRadioButton = props => (
  <RadioButtonGroupInput
    {...props}
    source='predefined_first_dueDate'
    label='Première date limite prédéfinie'
    choices={Object.keys(predefinedFirstDueDates).map(id => ({ id: id, name: predefinedFirstDueDates[id].name }))}
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

  const [feesConf, setFeesConf] = useState({
    monthlyAmount: null,
    monthsNumber: null,
    comment: null
  })

  const defaultIsPredefinedFirstDueDate = true
  const [isPredefinedFirstDueDate, setisPredefinedFirstDueDate] = useState(defaultIsPredefinedFirstDueDate)
  return (
    <Create
      {...props}
      title={`Frais de ${studentRef}`}
      resource='fees'
      basePath={`/students/${studentId}/fees`}
      transform={_feesConf => {
        const fees = []
        const firstDueDate = _feesConf.predefined_first_dueDate ? predefinedFirstDueDates[_feesConf.predefined_first_dueDate].value : 'TODO'
        for (var i = 0; i < _feesConf.months_number; i++) {
          fees.push({
            total_amount: _feesConf.monthly_amount,
            type: _feesConf.predefined_type ? predefinedFeeTypes[_feesConf.predefined_type].type : 'TODO',
            student_id: studentId,
            due_datetime: new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString(),
            comment: (_feesConf.predefined_type ? predefinedFeeTypes[_feesConf.predefined_type].name : 'TODO') + ` (${currentYear})`
          })
        }
        return fees
      }}
    >
      <SimpleForm>
        <BooleanInput
          source='is_predefined_type'
          label='Type prédéfini ?'
          defaultValue={defaultIsPredefinedType}
          fullWidth={true}
          onChange={value => setIsPredefinedType(value)}
        />
        {isPredefinedType ? (
          <PredefinedFeeTypeRadioButton setFeesConf={setFeesConf} validate={required()} />
        ) : (
          <ManualFeeTypeRadioButton validate={required()} />
        )}
        <FeesConfInput isPredefinedType={isPredefinedType} feesConf={feesConf} />

        <BooleanInput
          source='is_predefined_first_dueDate'
          label='Première date limite prédéfinie ?'
          defaultValue={defaultIsPredefinedFirstDueDate}
          fullWidth={true}
          onChange={value => setisPredefinedFirstDueDate(value)}
        />
        {isPredefinedFirstDueDate ? (
          <PredefinedFirstDueDateRadioButton validate={required()} />
        ) : (
          <DateInput source='first_duedate' label='Première date limite manuelle' fullWidth={true} validate={required()} />
        )}
      </SimpleForm>
    </Create>
  )
}

const FeesConfInput = ({ isPredefinedType, feesConf }) => {
  const form = useForm()
  form.change('monthly_amount', feesConf.monthlyAmount)
  form.change('months_number', feesConf.monthsNumber)
  form.change('comment', feesConf.name)

  const validateMonthlyAmount = [required(), number(), minValue(1)]
  const validateMonthsNumber = [required(), number(), minValue(1), maxValue(12)]
  return (
    <div>
      <TextInput source='monthly_amount' label='Montant de la mensualité' fullWidth={true} disabled={isPredefinedType} validate={validateMonthlyAmount} />
      <TextInput source='months_number' label='Nombre de mensualités' fullWidth={true} disabled={isPredefinedType} validate={validateMonthsNumber} />
      <TextInput source='comment' label='Commentaire' fullWidth={true} disabled={isPredefinedType} validate={required()} />
    </div>
  )
}
export default FeesCreate
