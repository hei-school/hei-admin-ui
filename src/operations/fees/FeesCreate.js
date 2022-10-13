import { useEffect, useState } from 'react'

import {
  BooleanInput,
  Create,
  DateInput,
  maxValue,
  minValue,
  number,
  RadioButtonGroupInput,
  required,
  SimpleForm,
  TextInput,
  useDataProvider
} from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { currentYear, manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../../conf'

const PredefinedFeeTypeRadioButton = ({ setFeesConf, ...props }) => (
  <RadioButtonGroupInput
    {...props}
    source='predefined_type'
    label='Type prédéfini'
    choices={Object.keys(predefinedFeeTypes).map(id => ({ id: id, name: predefinedFeeTypes[id][0].name }))}
    onChange={({ target: { value } }) => setFeesConf(predefinedFeeTypes[value])}
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
  const params = useParams()
  const studentId = params.studentId
  const [studentRef, setStudentRef] = useState('...')
  const dataProvider = useDataProvider()
  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne('students', { id: studentId })
      setStudentRef(student.data.ref)
    }
    doEffect()
    // eslint-disable-next-line
  }, [studentRef])

  const defaultIsPredefinedType = true
  const [isPredefinedType, setIsPredefinedType] = useState(defaultIsPredefinedType)

  const [feesConf, setFeesConf] = useState([
    {
      monthlyAmount: null,
      monthsNumber: null,
      comment: null
    }
  ])

  const defaultIsPredefinedFirstDueDate = true
  const [isPredefinedFirstDueDate, setIsPredefinedFirstDueDate] = useState(defaultIsPredefinedFirstDueDate)

  const feesConfToFeesApi = _feesConf => {
    const fees = []
    const toDate = str => {
      const parts = str.split('-')
      return new Date(parts[0], parts[1] - 1 /* note(js-months) */, parts[2])
    }
    const firstDueDate = _feesConf.is_predefined_first_dueDate
      ? predefinedFirstDueDates[_feesConf.predefined_first_dueDate].value
      : toDate(_feesConf.manual_first_duedate)
    if (feesConf.length <= 1) {
      for (let i = 0; i < _feesConf.months_number; i++) {
        fees.push({
          total_amount: _feesConf.monthly_amount,
          type: isPredefinedType ? predefinedFeeTypes[_feesConf.predefined_type][0].type : manualFeeTypes[_feesConf.manual_type]?.type,
          student_id: studentId,
          due_datetime: new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString(),
          comment: `${_feesConf.comment} (${currentYear})`
        })
      }
    } else {
      for (let j = 0; j < feesConf.length; j++) {
        for (let i = 0; i < feesConf[j].monthsNumber; i++) {
          fees.push({
            total_amount: feesConf[j].monthlyAmount,
            type: isPredefinedType ? predefinedFeeTypes[_feesConf.predefined_type][0].type : manualFeeTypes[_feesConf.manual_type].type,
            student_id: studentId,
            due_datetime: new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString(),
            comment: `${_feesConf.comment} (${currentYear})`
          })
        }
      }
    }
    console.log(fees)
    return fees
  }
  return (
    // https://marmelab.com/blog/2022/04/12/react-admin-v4-new-form-framework.html
    <Create
      {...props}
      title={`Frais de ${studentRef}`}
      resource='fees'
      redirect={(_basePath, _id, _data) => `students/${studentId}/fees`}
      transform={feesConfToFeesApi}
    >
      <SimpleForm>
        <BooleanInput
          source='is_predefined_type'
          label='Type prédéfini ?'
          name='is_predefined_type'
          defaultValue={defaultIsPredefinedType}
          onChange={({ target: { checked } }) => setIsPredefinedType(checked)}
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
          name='is_predefined_first_dueDate'
          defaultValue={defaultIsPredefinedFirstDueDate}
          fullWidth={true}
          onChange={({ target: { checked } }) => setIsPredefinedFirstDueDate(checked)}
        />
        {isPredefinedFirstDueDate ? (
          <PredefinedFirstDueDateRadioButton validate={required()} />
        ) : (
          <DateInput source='manual_first_duedate' name='manual_first_duedate' label='Première date limite manuelle' fullWidth={true} validate={required()} />
        )}
      </SimpleForm>
    </Create>
  )
}

const FeesConfInput = ({ isPredefinedType, feesConf }) => {
  const { setValue } = useFormContext()

  if (isPredefinedType) {
    setValue('monthly_amount', feesConf[0].monthlyAmount || 0)
    setValue('months_number', feesConf[0].monthsNumber || 0)
    setValue('comment', feesConf[0].name || '')
  }
  const validateMonthlyAmount = [required(), number(), minValue(1)]
  const validateMonthsNumber = [required(), number(), minValue(1), maxValue(12)]
  return (
    <div>
      <TextInput
        source='monthly_amount'
        name='monthly_amount'
        label='Montant de la mensualité'
        fullWidth={true}
        disabled={isPredefinedType}
        validate={validateMonthlyAmount}
      />
      <TextInput
        source='months_number'
        name='months_number'
        label='Nombre de mensualités'
        fullWidth={true}
        disabled={isPredefinedType}
        validate={validateMonthsNumber}
      />
      <TextInput source='comment' name='comment' label='Commentaire' fullWidth={true} disabled={isPredefinedType} validate={required()} />
    </div>
  )
}
export default FeesCreate
