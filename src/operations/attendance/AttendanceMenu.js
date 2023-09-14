import React from 'react'
import { Box, Typography } from '@mui/material'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import ListIcon from '@mui/icons-material/List'
import { Link } from 'react-admin'

const menuStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  gap: 5,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}
const cardBoxStyle = {
  padding: '15px',
  backgroundColor: 'rgba(0,0,125,.1)',
  borderRadius: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
}

function AttendanceMenu() {
  return (
    <Box sx={menuStyle}>
      <Typography variant='h3' sx={{ fontSize: '1.8em', textAlign: 'center', color: 'rgba(0,0,0,.8)' }}>
        Comment vous voulez faire le pointage ?
      </Typography>
      <Box component='div' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <Link to='/attendance/scan'>
          <Box sx={cardBoxStyle}>
            <QrCodeScannerIcon sx={{ fontSize: '5em' }} />
            <Typography variant='h3' sx={{ fontSize: '1em' }}>
              Par QRCode
            </Typography>
          </Box>
        </Link>
        <Link to='/attendance/list'>
          <Box sx={cardBoxStyle}>
            <ListIcon sx={{ fontSize: '5em' }} />
            <Typography variant='h3' sx={{ fontSize: '1em' }}>
              Par List
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default AttendanceMenu