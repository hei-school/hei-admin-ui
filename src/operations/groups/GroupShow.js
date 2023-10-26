import { Divider, Typography } from '@mui/material'
import { EditButton, Show, SimpleShowLayout, TextField, TopToolbar } from 'react-admin'
import { useParams } from 'react-router-dom'
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

const GroupShow = props => {
  const Actions = () => (
    <TopToolbar>
      <EditButton />
    </TopToolbar>
  )

  return (
    <Show actions={<Actions />} title='Groupe'>
      <GroupLayout />
    </Show>
  )
}

export default GroupShow
