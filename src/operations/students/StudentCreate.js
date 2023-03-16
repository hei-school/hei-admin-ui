import { useState } from 'react'
import { Create, SimpleForm, TextInput, DateInput, BooleanInput } from 'react-admin'
import { FeeSimpleFormContent } from '../fees/FeesCreate'
import { SexRadioButton } from '../utils'
import { currentYear, manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../../conf'

const StudentCreate = props => {
  const [feesConf, setFeesConf] = useState([
    {
      monthlyAmount: null,
      monthsNumber: null,
      comment: null
    }
  ])

  const defaultIsPredefinedType = true
  const [isPredefinedType, setIsPredefinedType] = useState(defaultIsPredefinedType)
  const useIsPredefinedType = data => {
    setIsPredefinedType(data)
  }
  const defaultCanCreateFees = false
  const [canCreateFees, setCanCreateFees] = useState(defaultCanCreateFees)
  const transformPayload = payload => {
    const {
      monthly_amount,
      manual_first_duedate,
      is_predefined_first_dueDate,
      predefined_first_dueDate,
      comment,
      months_number,
      manual_type,
      predefined_type,
      is_predefined_type,
      ...student
    } = payload
    const fees = []
    const toDate = str => {
      const parts = str.split('-')
      return new Date(parts[0], parts[1] - 1 /* note(js-months) */, parts[2])
    }
    if (canCreateFees) {
      const firstDueDate = is_predefined_first_dueDate ? predefinedFirstDueDates[predefined_first_dueDate].value : toDate(manual_first_duedate)
      let totalMonthsNumber = feesConf.reduce((acc, currentValue) => acc + currentValue.monthsNumber, 0)
      for (let j = 0; j < feesConf.length; j++) {
        let start = j === 0 ? 0 : totalMonthsNumber - (totalMonthsNumber - feesConf[j - 1].monthsNumber)
        let end = start + feesConf[j].monthsNumber
        for (let i = start; i < end; i++) {
          fees.push({
            total_amount: feesConf[j].monthlyAmount,
            type: isPredefinedType ? predefinedFeeTypes[predefined_type][0].type : manualFeeTypes[manual_type].type,
            due_datetime: new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString(),
            comment: `${comment} (${currentYear})`
          })
        }
      }
    }
    student.entrance_datetime = student.entrance_datetime.concat('T10:00:00.000Z')
    const result = [fees, student]
    return result
  }
  return (
    <Create title='Étudiants' transform={transformPayload} resource='students'>
      <SimpleForm>
        <TextInput source='ref' label='Référence' fullWidth={true} />
        <TextInput source='first_name' label='Prénoms' fullWidth={true} />
        <TextInput source='last_name' label='Nom' fullWidth={true} />
        <SexRadioButton />
        <TextInput source='phone' label='Téléphone' fullWidth={true} />
        <DateInput source='birth_date' label='Date de naissance' fullWidth={true} />
        <TextInput source='address' label='Adresse' fullWidth={true} multiline />
        <TextInput source='email' label='Email' fullWidth={true} />
        <DateInput source='entrance_datetime' label="Date d'entrée chez HEI" fullWidth={true} />
        <BooleanInput
          label='Activer la création des frais'
          name='can_create_fees'
          source=''
          defaultValue={defaultCanCreateFees}
          onChange={({ target: { checked } }) => setCanCreateFees(checked)}
        />
        {canCreateFees && <FeeSimpleFormContent passIsPredefinedType={useIsPredefinedType} setFeesConf={setFeesConf} feesConf={feesConf} />}
      </SimpleForm>
    </Create>
  )
}
export default StudentCreate
