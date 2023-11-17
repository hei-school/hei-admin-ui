import { TextField, EditButton} from 'react-admin'
import { CreateButton, ExportButton } from '../../ui/haToolbar'
import { HaList } from '../../ui/haList'
import { WorkOutlined } from '@mui/icons-material'
import { ProfileFilters } from '../profile'

export function TeacherList(){
  return (
    <HaList
      icon={<WorkOutlined />}
      title='Listes des enseignants'
      mainSearch={{source:'ref', label: 'Rérérence'}}
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
