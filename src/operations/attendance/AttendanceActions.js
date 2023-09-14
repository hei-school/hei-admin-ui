import React from 'react'
import { Box, Button } from '@mui/material'
import { ATTENDANCE_TYPE, tryToSendAttendance } from './utils'

function AttendanceActions({ selectedIds = [], sx = {} }) {
  const submitActions = type => {
    const attendanceData = {
      type,
      students: selectedIds,
      time: new Date().toISOString()
    }
    tryToSendAttendance(attendanceData)
  }

  return (
    <Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <Button
        variant='contained'
        color='primary'
        onClick={() => submitActions(ATTENDANCE_TYPE.CHECK_IN)}
      >
        Arriver
      </Button>
      <Button
        variant='contained'
        color='warning'
        onClick={() => submitActions(ATTENDANCE_TYPE.CHECK_OUT)}
      >
        Sortie
      </Button>
    </Box>
  )
}

export default AttendanceActions
