import React from 'react'
import { Box, Button } from '@mui/material'
import { getQrConfig, tryToSendAttendance } from './utils'
import { AttendanceMovementType } from '../../gen/haClient'

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
      <Button variant='contained' color='primary' onClick={() => submitActions(AttendanceMovementType.In)}>
        Arriver
      </Button>
      <Button variant='contained' color='warning' onClick={() => submitActions(AttendanceMovementType.Out)}>
        Sortie
      </Button>
    </Box>
  )
}

export default AttendanceActions
