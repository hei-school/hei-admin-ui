import React from 'react'
import { Box, Button} from '@mui/material'
import { addAttendance, getQrConfig } from './utils'
import { AttendanceMovementType } from '../../gen/haClient'
import { useNotify } from 'react-admin'

function AttendanceActions({ studentId = '', sx = {} }) {
  const notify = useNotify();
  
  const submitActions = type => {
    const attendanceData = {
      attedance_mouvement_type: type,
      student_id: studentId,
      created_at: new Date().toISOString(),
      place: getQrConfig().place
    }

    addAttendance(attendanceData)
    notify('Attendance réussi')
  }

  return (
    <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <Button variant='outlined' color='primary' onClick={() => submitActions(AttendanceMovementType.In)}>
        Arriver
      </Button>
      <Button variant='outlined' color='warning' onClick={() => submitActions(AttendanceMovementType.Out)}>
        Sortie
      </Button>
    </Box>
  )
}

export default AttendanceActions
