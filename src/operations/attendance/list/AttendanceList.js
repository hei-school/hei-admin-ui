import React, { useState } from 'react'
import { Datagrid, FunctionField, List, TextField } from 'react-admin'
import { PrevNextPagination, pageSize } from '../../utils'
import { formatDate } from '../utils'
import AttendanceAside from './AttendanceAside'
import ListActions from './ListActions'
import ShowOne from './ShowOne'

function AttendanceList() {
  const [showOne, setShowOne] = useState({ status: false, record: null })

  const showRecord = (id, ressource, record) => setShowOne({ status: true, record })

  return (
    <>
      <List
        title='Présences'
        hasCreate={false}
        perPage={pageSize}
        actions={<ListActions />}
        exporter={false}
        pagination={<PrevNextPagination />}
        aside={<AttendanceAside />}
      >
        <Datagrid bulkActionButtons={false} rowClick={showRecord}>
          <TextField source='student.ref' label='Référence' />
          <FunctionField label='Heure' render={record => formatDate(record.created_at) || '---'} />
          <TextField source='place' label='Lieu' />
          <TextField source='student.first_name' label='Prénom·s' />
          <TextField source='student.last_name' label='Nom·s' />
        </Datagrid>
      </List>
      <ShowOne showOne={showOne} setShowOne={setShowOne} />
    </>
  )
}

export default AttendanceList
