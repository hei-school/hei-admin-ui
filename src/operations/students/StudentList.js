import { EditButton, ShowButton, TextField } from 'react-admin'
import { SchoolOutlined, UploadFile } from '@mui/icons-material'
import { CreateButton, ExportButton } from '../../ui/haToolbar'
import { HaList } from '../../ui/haList'
import {  WhoamiRoleEnum } from '../../gen/haClient'
import authProvider from '../../providers/authProvider'
import { exporter, exportHeaders, importHeaders } from '../utils'
import { ProfileFilters } from '../profile'
import { ImportButton } from './ImportInputFile'

const ListActions = ({ isManager }) => {
  return (
    <>
      <CreateButton />
      {isManager && (
        <>
          <ExportButton exportHandler={() => exporter([], importHeaders, 'template_students')} label='Template' icon={<UploadFile />} />
          <ImportButton />
        </>
      )}
      <ExportButton exportHandler={list => exporter(list, exportHeaders, 'students')} />
      <ProfileFilters />
    </>
  )
}

function StudentList() {
  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <HaList
      icon={<SchoolOutlined />}
      title={'Listes des étudiants'}
      mainSearch={{label: 'Prénom·s', source: 'first_name'}}
      actions={<ListActions isManager={isManager} />}
    >
      <TextField source='ref' label='Référence' />
      <TextField source='first_name' label='Prénom·s' />
      <TextField source='last_name' label='Nom·s' />
      {isManager ? <EditButton /> : <ShowButton />}
    </HaList>
  )
}

export default StudentList