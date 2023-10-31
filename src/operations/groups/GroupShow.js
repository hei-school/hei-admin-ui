import { Divider, Typography } from '@mui/material'
import { EditButton, Show, SimpleShowLayout, TextField, TopToolbar } from 'react-admin'
import { WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { CustomDateField } from '../utils/DateHandling '
import GroupStudentList from './GroupStudentList'

export const GroupLayout = () => {
  return (
    <SimpleShowLayout>
      <TextField source='ref' label='Référence' />
      <TextField source='name' label='Nom' />
      <CustomDateField source='creation_datetime' label='Date de création' />
      <Divider />
      <Typography>Les étudiants dans ce groupe</Typography>
      <GroupStudentList />
    </SimpleShowLayout>
  )
}

const GroupShow = () => {
  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager

  const Actions = () => (
    <TopToolbar>
      <EditButton />
    </TopToolbar>
  )
  return (
    <Show actions={isManager && <Actions />} title='Groupe'>
      <GroupLayout />
    </Show>
  )
}

export default GroupShow
