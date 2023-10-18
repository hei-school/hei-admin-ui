import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import { AttendanceMovementType } from '../../../gen/haClient';
import { qrcode } from './config';

function Actions({ studentId, sx = {} }) {
  const [ clicked, setClicked ] = useState('')
  
  const removeClicked = async ()=> setTimeout(()=>setClicked(''), 2500)
  
  const handlerClick = (type)=>{
    if(clicked === ''){
      qrcode.addAttendance(studentId, type)
      setClicked(type) 
      removeClicked()
    }
  }

  return (
    <Box component='div' sx={{ display: 'flex',alignItems: 'center', gap: 1, ...sx }}>
      <Button variant='outlined' color='primary' onClick={()=>handlerClick(AttendanceMovementType.In)}>
        {clicked === AttendanceMovementType.In ? 'Succès' : 'Arriver'}
      </Button>
      <Button variant='outlined' color='warning' onClick={() => handlerClick(AttendanceMovementType.Out)}>
        {clicked === AttendanceMovementType.Out ? 'Succès' : 'Sortie'}
      </Button>
    </Box>
  )
}

export default Actions 
