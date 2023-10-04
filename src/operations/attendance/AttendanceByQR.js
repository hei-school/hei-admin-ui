import React, { useState, useEffect } from 'react'
import { Box, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import { SCAN_STATUS, addAttendance, getQrConfig } from './utils'
import AttendanceStatus from './AttendanceStatus'
import { Link } from 'react-admin'
import ListIcon from '@mui/icons-material/List'
import QrPageConfig from './QrPageConfig'
import { AttendanceMovementType } from '../../gen/haClient'
import createScannerBox, { ScannerBox } from './QrScanner'

function AttendanceByQR() {
  const [attendanceType, setAttendanceType] = useState(AttendanceMovementType.In)
  const [showConfig, setShowConfig] = useState(false)
  const [scanInfo, setScanInfo] = useState({
    status: SCAN_STATUS.NO_SCAN,
    data: ''
  })

  useEffect(() => {
    createScannerBox(scanInfo, setScanInfo);
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
    const newType = attendanceType === AttendanceMovementType.In ? AttendanceMovementType.Out : AttendanceMovementType.In
    setAttendanceType(newType)
  }

  return (
    <Box component='div' sx={{
      display:'flex',
      justifyContent:'center',
      width:'100%',
      height:'100%'
    }}>
      <Box component='div' sx={{ width: '100%', maxWidth: '700px',height:'fit-content',position: 'relative' }}>
        <ScannerBox id='reader' />
        <Box component='div' sx={{ display: 'flex', position: 'absolute', top: 0, right: 0, p: 1}}>
          <QrPageConfig openConfig={showConfig} setOpenConfig={setShowConfig} />
          <Link sx={{ p: 0, ml: 1 }} to='/attendance'>
            <ListIcon sx={{ fontSize: '40px !important',pt: '2px', color: 'white' }} />
          </Link>
        </Box>
        <AttendanceStatus scanInfo={{ ...scanInfo, type: attendanceType }} />
        <Box component='div' sx={{ position: 'absolute', bottom: 5, width: '100%' }}>
          <FormControl component='form' fullWidth onChange={toggleType}>
            <RadioGroup
              defaultValue={AttendanceMovementType.In}
              sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', m: 0, color: 'white' }}
            >
              <FormControlLabel value={AttendanceMovementType.In} control={<Radio sx={{ color: 'white' }} />} label='Entrer' />
              <FormControlLabel value={AttendanceMovementType.Out} control={<Radio sx={{ color: 'white' }} />} label='Sortie' />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </Box>
  )
}

export default AttendanceByQR
