import { TextField, EditButton } from 'react-admin'
import { CreateButton, ExportButton } from '../../ui/haToolbar'
import { HaList } from '../../ui/haList'
import { WorkOutlined } from '@mui/icons-material'
import { ProfileFilters } from '../profile'

function TeacherList() {
  return (
    <HaList
      icon={<WorkOutlined />}
      title='Liste des enseignants'
      mainSearch={{ label: 'Prénom·s', source: 'first_name' }}
      actions={
        <>
          <CreateButton />
          <ExportButton />
          <ProfileFilters />
        </>
      }
    >
      <TextField source='ref' label='Rérérence' />
      <TextField source='first_name' label='Prénom·s' />
      <TextField source='last_name' label='Nom·s' />
      <EditButton />
    </HaList>
  )
}

export default TeacherList
