import React, { useState, useEffect } from 'react'
import { Box, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { ATTENDANCE_TYPE, SCAN_STATUS } from './utils'
import AttendanceStatus from './AttendanceStatus'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'

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
  const [attendanceType, setAttendanceType]= useState(ATTENDANCE_TYPE.CHECK_IN)
  const [scanInfo, setScanInfo]= useState({
    status: SCAN_STATUS.NO_SCAN,
    data: ''
  })

  useEffect(()=>{
    const removeStatus = () => {
      setTimeout(() => {
        setScanInfo({...scanInfo,status: SCAN_STATUS.NO_SCAN})
        scanner.resume()
      },1500)
    }

    const scanSuccess = data => {
      scanner.pause(false);
      setScanInfo({status: SCAN_STATUS.SUCCESS, data})
      removeStatus()
    }
    
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250},
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };
    
    const scanner = new Html5QrcodeScanner('reader', config, false)
    scanner.render(scanSuccess)
  },[])
  
  //submit action
  useEffect(()=>{
    if(scanInfo.data){
      const attendanceData = {
        type: attendanceType,
        students: scanInfo.data,
        time: new Date().toISOString()
      }

      console.log("I will send", attendanceData);
    }
  },[scanInfo.data])

  const toggleType = () => {
    const newType = attendanceType === ATTENDANCE_TYPE.CHECK_IN ? ATTENDANCE_TYPE.CHECK_OUT : ATTENDANCE_TYPE.CHECK_IN
    setAttendanceType(newType)
  }
  
  return (
    <Box component='div' sx={QRContainerStyle}>
      <Box sx={{zIndex:99, width: '100%'}} component='div' id='reader'></Box>
      <Box sx={QRBoxStyle}>
        <AttendanceStatus scanInfo={{...scanInfo, type: attendanceType}}/> 
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