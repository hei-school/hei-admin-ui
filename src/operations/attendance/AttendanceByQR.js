import React, { useState, useEffect } from 'react'
import { Box, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { ATTENDANCE_TYPE, SCAN_STATUS, getQrConfig, tryToSendAttendance } from './utils'
import AttendanceStatus from './AttendanceStatus'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { Button, Link } from 'react-admin'
import ListIcon from '@mui/icons-material/List'
import QrPageConfig from './QrPageConfig'
import { useNavigate } from 'react-router-dom'

const QRContainerStyle = {
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
  justifyContent: 'space-between',
  mb: 2,
  position: 'absolute',
  top: 0,
  left: 0
}

function AttendanceByQR() {
  const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPE.CHECK_IN)
  const [showConfig, setShowConfig] = useState(false)
  const [scanInfo, setScanInfo] = useState({
    status: SCAN_STATUS.NO_SCAN,
    data: ''
  })
  const navigate = useNavigate()

  //have to use useEffect because the camera makes a lot of time to start
  useEffect(() => {
    const removeStatus = () => {
      setTimeout(() => {
        setScanInfo({ ...scanInfo, status: SCAN_STATUS.NO_SCAN })
        scanner.resume()
      }, getQrConfig().pauseDelay * 1000)
    }

    const scanSuccess = data => {
      scanner.pause(false)
      setScanInfo({ status: SCAN_STATUS.SUCCESS, data })
      removeStatus()
    }

    const config = {
      fps: 10,
      qrbox: { width: getQrConfig().boxSize, height: getQrConfig().boxSize },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    }

    const scanner = new Html5QrcodeScanner('reader', config, false)
    scanner.render(scanSuccess)
  }, [getQrConfig().pauseDelay, getQrConfig().boxSize])

  //submit action
  useEffect(() => {
    if (scanInfo.data) {
      const attendanceData = {
        attendance_movement_type: attendanceType,
        student_id: scanInfo.data,
        created_at: new Date().toISOString(),
        place: getQrConfig().place
      }

      tryToSendAttendance(attendanceData)
    }
  }, [scanInfo.data])

  const toggleType = () => {
    const newType = attendanceType === ATTENDANCE_TYPE.CHECK_IN ? ATTENDANCE_TYPE.CHECK_OUT : ATTENDANCE_TYPE.CHECK_IN
    setAttendanceType(newType)
  }

  return (
    <Box component='div' sx={QRContainerStyle}>
      <Box sx={{ zIndex: 99, maxWidth: '500px', width: '100%' }} component='div' id='reader'></Box>
      <Box sx={QRBoxStyle}>
        <Box component='div' sx={{ width: '100%', display: 'flex', alignItems: 'center', p: 2, gap: 2, justifyContent: 'end' }}>
          <QrPageConfig openConfig={showConfig} setOpenConfig={setShowConfig} />
          <Button variant='text' sx={{ p: 0 }} onClick={() => navigate('/attendance/list')}>
            <ListIcon sx={{ fontSize: '35px !important' }} />
          </Button>
        </Box>
        <Box component='div'>
          <AttendanceStatus scanInfo={{ ...scanInfo, type: attendanceType }} />
          <FormControl component='form' onChange={toggleType}>
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
      </Box>
    </Box>
  )
}

export default AttendanceByQR
