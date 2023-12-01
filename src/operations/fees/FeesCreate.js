import { useEffect, useState } from 'react'
import {
  Create,
  maxValue,
  minValue,
  number,
  required,
  SimpleForm,
  TextInput,
  useNotify
} from 'react-admin'
import { useFormContext } from 'react-hook-form'
import { manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../../conf'
import { useStudentRef, useCreateFees } from '../../hooks'
import { commentRenderer, toUTC } from '../utils'
import { FeesCreateField } from './FeesCreateField'
import { defaultFeeConf, getLastDay } from './utils'

const FeesCreate = props => {
  const notify = useNotify()
  const [feesConf, setFeesConf] = useState([defaultFeeConf])
  const { studentId, studentRef, fetchRef }  = useStudentRef('studentId')
  const createFeesConf = useCreateFees()
  const { isPredefinedType, firstDate } = createFeesConf
   
  useEffect(() => {
    fetchRef()
  }, [studentRef])
  
  const feesConfToFeesApi = _feesConf => {
    const fees = []
    const toDate = str => {
      const parts = str.split('-')
      return new Date(parts[0], parts[1] - 1 /* note(js-months) */, parts[2])
    }
    const firstDueDate = _feesConf.is_predefined_first_dueDate
      ? predefinedFirstDueDates[_feesConf.predefined_first_dueDate].value
      : toDate(_feesConf.manual_first_duedate)
    const isLastDay = isPredefinedType && _feesConf.predefined_first_dueDate === 'date3'
    const currentDate = new Date(firstDate.year, firstDate.month, 1) 
    
    const createDueDatetime = (index)=>{
      if(isLastDay){
        const result = toUTC(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)).toISOString()
        currentDate.setMonth(currentDate.getMonth() + 1)
        return result;
      }

      return toUTC(new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + index, firstDueDate.getDate())).toISOString()
    }

    let totalMonthsNumber = feesConf.reduce((acc, currentValue) => acc + currentValue.monthsNumber, 0)
    if (feesConf.length <= 1) {
      for (let i = 0; i < _feesConf.months_number; i++) {
        fees.push({
          total_amount: _feesConf.monthly_amount,
          type: isPredefinedType ? predefinedFeeTypes[_feesConf.predefined_type][0].type : manualFeeTypes[_feesConf.manual_type]?.type,
          student_id: studentId,
          due_datetime: createDueDatetime(i) ,
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
            due_datetime: createDueDatetime(i) ,
            comment: commentRenderer(_feesConf.comment, totalMonthsNumber, i)
          })
        }
      }
    }
    return fees
  }
  return (
    <Create
      mutationOptions={{
        onError: () => {
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
        <FeesCreateField createFeesConf={createFeesConf} setFeesConf={setFeesConf} feesConf={feesConf} />
      </SimpleForm>
    </Create>
  )
}

export const FeesConfInput = ({ isPredefinedType, feesConf }) => {
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
