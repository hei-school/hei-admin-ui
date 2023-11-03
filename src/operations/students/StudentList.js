import { CreateButton, Datagrid, EditButton, ExportButton, FilterButton, List, ShowButton, TextField, TopToolbar, useNotify } from 'react-admin'
import authProvider from '../../providers/authProvider'

import { EnableStatus, WhoamiRoleEnum } from '../../gen/haClient'

import { profileFilters } from '../profile'
import { exporter, exportHeaders, importHeaders, pageSize, PrevNextPagination, validateData } from '../utils'
import { UploadFile } from '@mui/icons-material'
import ImportListButton from '../utils/ImportListButton'
import studentProvider from '../../providers/studentProvider'

const ListActions = () => {
  const role = authProvider.getCachedRole()
  const notify = useNotify()

  const isManager = role === WhoamiRoleEnum.Manager
  const addStudents = async (data, setData) => {
    const importValidate = validateData(data)

    if (importValidate.isValid) {
      const modifiedData = data.map(element => {
        element.entrance_datetime = new Date(element.entrance_datetime).toISOString()
        element['status'] = EnableStatus.Enabled
      })

      setData(modifiedData)

      await studentProvider
        .saveOrUpdate(data)
        .then(() => notify(`Importation effectuée avec succès`, { type: 'success', autoHideDuration: 1000 }))
        .catch(() => notify(`L'importation n'a pas pu être effectuée`, { type: 'error', autoHideDuration: 1000 }))
    } else {
      notify(importValidate.message, { type: 'error', autoHideDuration: 1000 })
    }
  }

  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton />
      {isManager && (
        <>
          <ImportListButton mutationRequest={addStudents} />
          <ExportButton exporter={() => exporter([], importHeaders, 'template_students')} label='TEMPLATE' startIcon={<UploadFile />} />
        </>
      )}
    </TopToolbar>
  )
}

const StudentList = () => {
  const role = authProvider.getCachedRole()

  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <List
      label='Étudiants'
      hasCreate={isManager}
      actions={<ListActions />}
      filters={profileFilters}
      exporter={list => exporter(list, exportHeaders, 'students')}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
    >
      <Datagrid bulkActionButtons={false} rowClick='show'>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        {isManager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default StudentList
