import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import AttendanceActions from './AttendanceActions'
import QrReader from 'modern-react-qr-reader'

// const QRCenter = {
//   border: 'solid 1px white',
//   width: '200px',
//   height: '200px'
// }

const QRContainerStyle = {
  maxWidth: '500px',
  width: '100%',
  height: 'calc(100% - 10px)',
  mx: 'auto',
  py: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}

const QRBoxStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'space-between',
  py: 2,
  mb: 2,
  position: 'absolute',
  top: 0,
  left: 0,
}

//should work here
function AttendanceByQR() {
  const [scannerResult, setScannerResult] = useState('')
  const [notShowActions, setNotShowActions] = useState(true)

  const scanSuccess = (data) => {
    if (data){
      setScannerResult(data)
      setNotShowActions(false)
    } 
  }

  const scanFailed = (error) => {
    console.log(error)
  }

  return (
    <Box component='div' sx={QRContainerStyle}>
      <QrReader
        delay={100}
        onScan={scanSuccess}
        onError={scanFailed}
        facingMode={'environment'}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <Box sx={QRBoxStyle}>
        <Typography sx={{ fontWeight: 'bold', color: 'rgb(255,255,255)' }}>
          Veuiller scanner la carte
        </Typography>
        <Box>
          <Typography sx={{mb: 2}}>
            {scannerResult ? `STD : ${scannerResult}` : 'STD Pas trouver'}
          </Typography>
          <AttendanceActions sx={{ gap: 3 }} selectedIds={[]} disable={notShowActions} />
        </Box>
      </Box>
    </Box>
  )
}

export default AttendanceByQR