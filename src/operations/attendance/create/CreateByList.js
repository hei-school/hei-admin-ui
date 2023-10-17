import React from 'react'
import { List } from '@react-admin/ra-rbac'
import { Datagrid, FunctionField, TextField } from 'react-admin'
import { PrevNextPagination, pageSize } from '../../utils'
import ToolBar from './Toolbar'
import Actions from './Actions'

const CreateByList = () => {
  return (
    <List
      title='Présence'
      label='Présence'
      actions={<ToolBar />}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
      resource='students'
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        <FunctionField render={record => <Actions sx={{ gap: 2, justifyContent:'end'}} studentId={record.ref} />} />
      </Datagrid>
    </List>
  )
}

export default CreateByList 
