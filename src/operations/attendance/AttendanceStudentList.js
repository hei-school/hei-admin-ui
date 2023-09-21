import React from 'react'
import { List } from '@react-admin/ra-rbac'
import { Datagrid, FunctionField, Link, TextField, TextInput } from 'react-admin'
import { PrevNextPagination, pageSize } from '../utils'
import AttendanceActions from './AttendanceActions'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { AVAILABLE_PLACE, getQrConfig, setQrConfig } from './utils'
import { Box, Select, MenuItem } from '@mui/material'

const AttendanceStudentList = () => {
  return (
    <List
      title='Pointage'
      label='Pointage'
      actions={
        <Box component='div' sx={{display:'flex', alignItems:'center', gap: 2}}>
          <Link to='/attendance/scan'>
            <QrCodeScannerIcon sx={{ fontSize: '2em' }} />
          </Link>
          <Select
            id='place'
            name='place'
            defaultValue={getQrConfig().place}
            variant='outlined'
            autoWidth
            size='small'
            onChange={(event)=>setQrConfig({...getQrConfig(),place:event.target.value})}
          >
            {AVAILABLE_PLACE.map((place, id)=> <MenuItem key={id} value={place}>{place}</MenuItem>)}
          </Select>
        </Box>
      }
      hasShow={false}
      filters={[<TextInput source='first_name' label='Filtre par prénom·s' alwaysOn />]}
      perPage={pageSize}
      exporter={false}
      pagination={<PrevNextPagination />}
      resource='students'
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        <FunctionField label='Actions' render={record => <AttendanceActions sx={{ gap: 5 }} studentId={record.ref}/>} />
      </Datagrid>
    </List>
  )
}

export default AttendanceStudentList
