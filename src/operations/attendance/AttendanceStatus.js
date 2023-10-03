import React from 'react'
import { Typography } from '@mui/material'
import { SCAN_STATUS } from './utils'

function AttendanceStatus({ scanInfo }) {
  const style = {
    mt: 2,
    textAlign: 'center',
    position:'absolute',
    bottom:'80px',
    width:'100%',
    left: '0',
    color: 'rgb(0,240,0)'
  }
  return scanInfo.status === SCAN_STATUS.SUCCESS ? <Typography sx={{ ...style}}>STD: {scanInfo.data}</Typography> : null
}

export default AttendanceStatus
