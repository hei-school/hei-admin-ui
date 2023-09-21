import React from 'react'
import { Box, Button } from '@mui/material'
import { ATTENDANCE_TYPE, getQrConfig, tryToSendAttendance } from './utils'

function AttendanceActions({ studentId = '', sx = {} }) {
  const submitActions = type => {
    const attendanceData = {
      attedance_mouvement_type: type,
      student_id: studentId,
      created_at: new Date().toISOString(),
      place: getQrConfig().place
    }
    tryToSendAttendance(attendanceData)
  }

  return (
    <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <Button variant='contained' color='primary' onClick={() => submitActions(ATTENDANCE_TYPE.CHECK_IN)}>
        Arriver
      </Button>
      <Button variant='contained' color='warning' onClick={() => submitActions(ATTENDANCE_TYPE.CHECK_OUT)}>
        Sortie
      </Button>
    </Box>
  )
}

export default AttendanceActions
