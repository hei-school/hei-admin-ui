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
  useDataProvider,
  useNotify
} from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../../conf'
import { useStudentRef } from '../../hooks/useStudentRef'
import { commentRenderer, toUTC } from '../utils'
import { PredefinedFeeTypeRadioButton, PredefinedFirstDueDateRadioButton } from './Predefined'
import { defaultFeeConf } from './utils'

const defaultIsPredefinedType = true

const ManualFeeTypeRadioButton = props => (
  <RadioButtonGroupInput
    {...props}
    source='manual_type'
    label='Type manuel'
    choices={Object.keys(manualFeeTypes).map(id => ({ id: id, name: manualFeeTypes[id].name }))}
  />
)

export const FeeSimpleFormContent = props => {
  const { feesConf, setFeesConf, passIsPredefinedType } = props
  const [isPredefinedType, setIsPredefinedType] = useState(defaultIsPredefinedType)
  const defaultIsPredefinedFirstDueDate = true
  const [isPredefinedFirstDueDate, setIsPredefinedFirstDueDate] = useState(defaultIsPredefinedFirstDueDate)
  passIsPredefinedType(isPredefinedType)
  return (
    <>
      <BooleanInput
        source='is_predefined_type'
        label='Type prédéfini ?'
        name='is_predefined_type'
        defaultValue={defaultIsPredefinedType}
        onChange={({ target: { checked } }) => setIsPredefinedType(checked)}
      />
      {isPredefinedType ? <PredefinedFeeTypeRadioButton setFeesConf={setFeesConf} validate={required()} /> : <ManualFeeTypeRadioButton validate={required()} />}
      <FeesConfInput isPredefinedType={isPredefinedType} feesConf={feesConf} />

      <BooleanInput
        source='is_predefined_first_dueDate'
        label='Première date limite prédéfinie ?'
        name='is_predefined_first_dueDate'
        defaultValue={defaultIsPredefinedFirstDueDate}
        fullWidth
        onChange={({ target: { checked } }) => setIsPredefinedFirstDueDate(checked)}
      />
      {isPredefinedFirstDueDate ? (
        <PredefinedFirstDueDateRadioButton validate={required()} />
      ) : (
        <DateInput source='manual_first_duedate' name='manual_first_duedate' label='Première date limite manuelle' fullWidth validate={required()} />
      )}
    </>
  )
}
const FeesCreate = props => {
  const notify = useNotify()
  const [feesConf, setFeesConf] = useState([defaultFeeConf])
  const { studentId, studentRef, fetchRef }  = useStudentRef('studentId')
  
  useEffect(() => {
    fetchRef()
  }, [studentRef])

  const [isPredefinedType, setIsPredefinedType] = useState(defaultIsPredefinedType)
  const useIsPredefinedType = data => {
    setIsPredefinedType(data)
  }
  const feesConfToFeesApi = _feesConf => {
    const fees = []
    const toDate = str => {
      const parts = str.split('-')
      return new Date(parts[0], parts[1] - 1 /* note(js-months) */, parts[2])
    }
    const firstDueDate = _feesConf.is_predefined_first_dueDate
      ? predefinedFirstDueDates[_feesConf.predefined_first_dueDate].value
      : toDate(_feesConf.manual_first_duedate)
    let totalMonthsNumber = feesConf.reduce((acc, currentValue) => acc + currentValue.monthsNumber, 0)
    if (feesConf.length <= 1) {
      for (let i = 0; i < _feesConf.months_number; i++) {
        fees.push({
          total_amount: _feesConf.monthly_amount,
          type: isPredefinedType ? predefinedFeeTypes[_feesConf.predefined_type][0].type : manualFeeTypes[_feesConf.manual_type]?.type,
          student_id: studentId,
          due_datetime: toUTC(new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate())).toISOString(),
          comment: commentRenderer(_feesConf.comment, totalMonthsNumber, i)
        })
      }
    } else {
      for (let j = 0; j < feesConf.length; j++) {
        const start = j === 0 ? 0 : totalMonthsNumber - (totalMonthsNumber - feesConf[j - 1].monthsNumber)
        const end = start + feesConf[j].monthsNumber
        for (let i = start; i < end; i++) {
          fees.push({
            total_amount: feesConf[j].monthlyAmount,
            type: isPredefinedType ? predefinedFeeTypes[_feesConf.predefined_type][0].type : manualFeeTypes[_feesConf.manual_type].type,
            student_id: studentId,
            due_datetime: toUTC(new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate())).toISOString(),
            comment: commentRenderer(_feesConf.comment, totalMonthsNumber, i)
          })
        }
      }
    }
    return fees
  }
  return (
    // https://marmelab.com/blog/2022/04/12/react-admin-v4-new-form-framework.html
    <Create
      mutationOptions={{
        onError: error => {
          notify(`Une erreur s'est produite`, { type: 'error', autoHideDuration: 1000 })
        }
      }}
      {...props}
      title={`Frais de ${studentRef}`}
      resource='fees'
      redirect={(_basePath, _id, _data) => `students/${studentId}/fees`}
      transform={feesConfToFeesApi}
    >
      <SimpleForm>
        <FeeSimpleFormContent passIsPredefinedType={useIsPredefinedType} setFeesConf={setFeesConf} feesConf={feesConf} />
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
        fullWidth
        disabled={isPredefinedType}
        validate={validateMonthlyAmount}
      />
      <TextInput
        source='months_number'
        name='months_number'
        label='Nombre de mensualités'
        fullWidth
        disabled={isPredefinedType}
        validate={validateMonthsNumber}
      />
      <TextInput source='comment' name='comment' label='Commentaire' fullWidth disabled={isPredefinedType} />
    </div>
  )
}
export default FeesCreate
