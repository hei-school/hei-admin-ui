import React from 'react'
import { Box, Typography } from '@mui/material'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import ListIcon from '@mui/icons-material/List'
import { Link } from 'react-admin'
import { styled } from '@mui/styles'

const MenuContainer = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  gap: 5,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
})

const CardMenu = styled('div')({
  padding: '15px',
  backgroundColor: 'rgba(0,0,125,.1)',
  borderRadius: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
})

function AttendanceMenu() {
  return (
    <MenuContainer>
      <Typography variant='h3' sx={{ fontSize: '1.4em', textAlign: 'center', color: 'rgba(0,0,0,.8)' }}>
        Comment voulez-vous faire le pointage ?
      </Typography>
      <Box component='div' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <Link to='/attendance/scan'>
          <CardMenu>
            <QrCodeScannerIcon sx={{ fontSize: '3em' }} />
            <Typography variant='h3' sx={{ fontSize: '1em' }}>
              Par QRCode
            </Typography>
          </CardMenu>
        </Link>
        <Link to='/attendance/list'>
          <CardMenu>
            <ListIcon sx={{ fontSize: '3em' }} />
            <Typography variant='h3' sx={{ fontSize: '1em' }}>
              Par List
            </Typography>
          </CardMenu>
        </Link>
      </Box>
    </MenuContainer>
  )
}

export default AttendanceMenu
