import React, { useState, useEffect } from 'react'
import { Box, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import {  SCAN_STATUS, addAttendance, getQrConfig } from './utils'
import AttendanceStatus from './AttendanceStatus'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { Button } from 'react-admin'
import ListIcon from '@mui/icons-material/List'
import QrPageConfig from './QrPageConfig'
import { useNavigate } from 'react-router-dom'
import { AttendanceMovementType } from '../../gen/haClient'

const QRContainerStyle = {
  width: '100%',
  height: 'fit-content',
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  position: 'relative'
}

function AttendanceByQR() {
  const [attendanceType, setAttendanceType] = useState(AttendanceMovementType.In)
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
      fps: getQrConfig().fps,
      qrbox: { width: getQrConfig().boxSize, height: getQrConfig().boxSize },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    }

    const scanner = new Html5QrcodeScanner('reader', config, false)
    scanner.render(scanSuccess)
  }, [getQrConfig().pauseDelay, getQrConfig().boxSize, getQrConfig().fps])

  //submit action
  useEffect(() => {
    if (scanInfo.data) {
      const attendanceData = {
        attendance_movement_type: attendanceType,
        student_id: scanInfo.data,
        created_at: new Date().toISOString(),
        place: getQrConfig().place
      }
      
      addAttendance(attendanceData)
    }
  }, [scanInfo.data])

  const toggleType = () => {
    const newType = attendanceType === AttendanceMovementType.In ? AttendanceMovementType.Out: AttendanceMovementType.In
    setAttendanceType(newType)
  }

  return (
    <Box component='div' sx={QRContainerStyle}>
      <Box sx={{  maxWidth: '500px',  width: '100%' }} component='div' id='reader' />
      <Box component='div' sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, gap: 2, 
        justifyContent: 'end',
        position:'absolute',
        top: 0,
        right: 0 ,
      }}>
        <QrPageConfig openConfig={showConfig} setOpenConfig={setShowConfig} />
        <Button variant='text' sx={{ p: 0 }} onClick={() => navigate('/attendance/list')}>
          <ListIcon sx={{ fontSize: '35px !important', color: 'white'}} />
        </Button>
      </Box>
      <AttendanceStatus scanInfo={{ ...scanInfo, type: attendanceType }} />
      <Box 
        component='div' 
        sx={{
          position: 'absolute',
          bottom: -50, 
          width: '100%',
          display:'flex',
          flexDirection: 'column',
          alignItems:'center',
          jusitifyContent: 'center'
        }}
      >
        <FormControl component='form' onChange={toggleType}>
          <RadioGroup
            aria-labelledby='attendance-actions'
            defaultValue={AttendanceMovementType.In}
            name='attendance-actions-group'
            sx={{ display: 'flex', alignItems: 'center',flexDirection: 'row', m: 0 }}
          >
            <FormControlLabel value={AttendanceMovementType.In} control={<Radio />} label='Entrer' />
            <FormControlLabel value={AttendanceMovementType.Out} control={<Radio />} label='Sortie' />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  )
}

export default AttendanceByQR
