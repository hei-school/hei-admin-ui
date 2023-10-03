import React from 'react'
import { List } from '@react-admin/ra-rbac'
import { Datagrid, FunctionField, TextField } from 'react-admin'
import { PrevNextPagination, pageSize } from '../utils'
import AttendanceActions from './AttendanceActions'
import ListToolBar from './ListToolBar'
import { profileFilters } from '../profile'

const AttendanceStudentList = () => {
  return (
    <List
      title='Attendance'
      label='Attendance'
      actions={<ListToolBar />}
      hasShow={false}
      filters={profileFilters}
      perPage={pageSize}
      exporter={false}
      pagination={<PrevNextPagination />}
      resource='students'
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        <FunctionField label='Actions' render={record => <AttendanceActions sx={{ gap: 2 }} studentId={record.ref} />} />
      </Datagrid>
    </List>
  )
}

export default AttendanceStudentList