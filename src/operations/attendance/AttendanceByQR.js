import React, { useState } from 'react'
import { Box, Typography, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import QrReader from 'modern-react-qr-reader'
import './qr.css'
import { ATTENDANCE_TYPE } from './utils'

const SCAN_STATUS = { ERROR: 'ERROR', SUCCESS: 'SUCCESS', NO_SCAN: 'NO_SCAN' }

const QRContainerStyle = {
  maxWidth: '500px',
  width: '100%',
  height: 'calc(100% - 10px)',
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
}

const QRBoxStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'end',
  mb: 2,
  position: 'absolute',
  top: 0,
  left: 0
}

function AttendanceByQR() {
  const [scanInfo, setScanInfo] = useState({
    type: ATTENDANCE_TYPE.CHECK_IN,
    status: SCAN_STATUS.NO_SCAN,
    data: '',
    havePending: false
  })

  const removeStatus = () => {
    setTimeout(() => setScanInfo({ ...scanInfo, status: SCAN_STATUS.NO_SCAN, havePending: false }), 3000)
  }

  const scanSuccess = data => {
    if (!scanInfo.havePending && data && data !== scanInfo.data) {
      setScanInfo({ ...scanInfo, data, status: SCAN_STATUS.SUCCESS, havePending: true })

      const attendanceData = {
        type: scanInfo.type,
        students: data,
        time: new Date().toISOString()
      }
      console.log('things that will be send', attendanceData)
      removeStatus()
    }
  }

  const scanFailed = error => {
    console.log(error)
    setScanInfo({ ...scanInfo, status: SCAN_STATUS.ERROR, havePending: true })
    removeStatus()
  }

  const toggleType = () => {
    const newType = scanInfo.type === ATTENDANCE_TYPE.CHECK_IN ? ATTENDANCE_TYPE.CHECK_OUT: ATTENDANCE_TYPE.CHECK_IN
    setScanInfo({ ...scanInfo, type: newType })
  }

  return (
    <Box component='div' sx={QRContainerStyle}>
      <QrReader
        delay={100}
        onScan={scanSuccess}
        onError={scanFailed}
        facingMode={'environment'}
        className={`qr-scanner`}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
      <Box sx={QRBoxStyle}>
        <Typography sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
          {scanInfo.status !== SCAN_STATUS.NO_SCAN ? `STD trouver : ${scanInfo.data}` : 'Scanning...'}
        </Typography>
        <FormControl
          component='form'
          onChange={toggleType}
        >
          <RadioGroup
            aria-labelledby='attendance-actions'
            defaultValue={ATTENDANCE_TYPE.CHECK_IN}
            name='attendance-actions-group'
            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', m: 0 }}
          >
            <FormControlLabel value={ATTENDANCE_TYPE.CHECK_IN} control={<Radio />} label='Entrer' />
            <FormControlLabel value={ATTENDANCE_TYPE.CHECK_OUT} control={<Radio />} label='Sortie' />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box >
  )
}

export default AttendanceByQR
