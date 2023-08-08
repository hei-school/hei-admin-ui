import { Form, RadioButtonGroupInput, Edit, SaveButton, Toolbar } from 'react-admin'

import { SexRadioButton, EditToolBar, TurnsStringIntoDate } from '../utils'
import Input from '../utils/Input'

import { Box } from '@mui/material'

const StatusRadioButton = () => (
  <RadioButtonGroupInput
    source='status'
    label='Statut'
    choices={[
      { id: 'ENABLED', name: 'Actif·ve' },
      { id: 'DISABLED', name: 'Inactif·ve' }
    ]}
  />
)

const transformUser = user => {
  let regex = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/i // format 2023-02-28T21:00:00.00Z
  let regex2 = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\Z/i // 2023-02-28T21:00:00Z
  let condition = !regex.test(user.entrance_datetime) && !regex2.test(user.entrance_datetime)
  user.entrance_datetime = condition ? TurnsStringIntoDate(user.entrance_datetime) : user.entrance_datetime
  return user
}

const ProfileEdit = () => (
  <Edit transform={transformUser}>
    <Form toolbar={<EditToolBar />}>
      <Box sx={{ display: 'flex', flexDirection: 'row', mt: '30px' }}>
        <Box sx={{ ml: '150px' }}>
          <Input source='last_name' placeholder='Nom(s)' />
          <Input source='first_name' placeholder='Prénom(s)' />
          <Input source='birth_date' label='' placeholder='Date de naissance' type='date' />
          <Input multiline source='address' placeholder='Adresse' />
          <SexRadioButton />
        </Box>

        <Box sx={{ ml: '70px' }}>
          <Input source='email' placeholder='Email' />
          <Input source='phone' placeholder='Téléphone' />
          <Input source='entrance_datetime' label='' placeholder="Date d'entrée chez HEI" type='date' />
          <Input source='ref' placeholder='Référence' />
          <StatusRadioButton />
          <SaveButton
            sx={{
              margin: '100px 0px 30px 120px',
              height: '50px',
              bgcolor: '#F8BF4F',
              borderRadius: '50px',
              boxShadow: 'none',
              color: 'black',
              '&:hover': {
                bgcolor: '#F8BF4F',
                boxShadow: 'none'
              }
            }}
          />
        </Box>
      </Box>
    </Form>
  </Edit>
)

export default ProfileEdit
