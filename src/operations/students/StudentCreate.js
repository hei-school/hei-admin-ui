import { useState } from 'react'
import { Create, Form } from 'react-admin'
import { FeeSimpleFormContent } from '../fees/FeesCreate'
import { SexRadioButton, TurnsStringIntoDate, Input, Save, BoolInput } from '../utils'
import { createFees } from './utils'

import { Box } from '@mui/material'

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
    if (canCreateFees) {
      createFees(fees, feesConf, payload, isPredefinedType)
    }
    student.entrance_datetime = TurnsStringIntoDate(student.entrance_datetime)
    const result = [fees, student]
    return result
  }
  return (
    <Create title='Étudiants' transform={transformPayload} resource='students'>
      <Form>
        <Box sx={{ display: 'flex', flexDirection: 'row', mt: '20px', ml: '50px' }}>
          <Box>
            <Input source='last_name' placeholder='Nom' />
            <Input source='first_name' placeholder='Prénoms' />
            <Input source='birth_date' placeholder='Date de naissance' type='date' />
            <SexRadioButton />
            <Input source='address' placeholder='Adresse' multiline />
            <Input source='phone' placeholder='Téléphone' />
            <Input source='email' placeholder='Email' />
            <Save />
          </Box>
          <Box sx={{ ml: '50px' }}>
            <Input source='ref' placeholder='Référence' />
            <Input source='entrance_datetime' placeholder="Date d'entrée chez HEI" type='date' />
            <BoolInput
              label='Activer la création des frais'
              name='can_create_fees'
              source=''
              defaultValue={defaultCanCreateFees}
              onChange={({ target: { checked } }) => setCanCreateFees(checked)}
            />

            {canCreateFees && <FeeSimpleFormContent passIsPredefinedType={useIsPredefinedType} setFeesConf={setFeesConf} feesConf={feesConf} />}
          </Box>
        </Box>
      </Form>
    </Create>
  )
}
export default StudentCreate
