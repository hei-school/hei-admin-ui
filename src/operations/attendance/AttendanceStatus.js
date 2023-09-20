import React from 'react'
import { Typography } from '@mui/material'
import { SCAN_STATUS } from './utils'

function AttendanceStatus({ scanInfo }) {
  switch (scanInfo.status) {
    case SCAN_STATUS.SUCCESS:
      return <Typography sx={{ mt: 2, textAlign: 'center', color: 'rgb(0,240,0)' }}></Typography>
    default:
      return <Typography sx={{ mt: 2, textAlign: 'center', color: 'rgba(0,0,0,.8)' }}>Veuiller scanner la carte</Typography>
  }
}

export default AttendanceStatus
