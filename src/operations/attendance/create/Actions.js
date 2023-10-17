import React from 'react'
import { Box, Button } from '@mui/material'
import { useNotify } from 'react-admin'
import { AttendanceMovementType } from '../../../gen/haClient';
import { qrcode } from './config';

function Actions({ studentId, sx = {} }) {
  const notify = useNotify();
  const submitActions = type => {
    qrcode.addAttendance(studentId, type)
    notify('Succès')
  }

  return (
    <Box component='div' sx={{ display: 'flex',alignItems: 'center', gap: 1, ...sx }}>
      <Button variant='outlined' color='primary' onClick={() => submitActions(AttendanceMovementType.In)}>
        Arriver
      </Button>
      <Button variant='outlined' color='warning' onClick={() => submitActions(AttendanceMovementType.Out)}>
        Sortie
      </Button>
    </Box>
  )
}

export default Actions 
