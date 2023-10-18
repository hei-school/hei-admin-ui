import React, { useState, useEffect } from 'react'
import { Box, FormControl, RadioGroup, Radio, FormControlLabel, IconButton } from '@mui/material'
import { ScanStatus, qrcode } from './config'
import { Link } from 'react-admin'
import { Close } from '@mui/icons-material'
import PageConfig from './PageConfig'
import { AttendanceMovementType } from '../../../gen/haClient'
import { createScanner, ScannerBox } from './QrScanner'
import { styled } from '@mui/styles'

const StatusStyled = styled('p')({
  mt: 2,
  textAlign: 'center',
  position:'absolute',
  bottom:'80px',
  width:'100%',
  left: 0,
  color: 'rgb(0,240,0)'
})

function CreateByScan() {
  const { getConfig, setConfig } = qrcode
  const [info, setInfo] = useState({ status: ScanStatus.NoScan, data: ''})
  const [current, setCurrent] = useState({ type: getConfig().type, open: false })
  const [ scanner, setScanner ] = useState(null);
 
  //unmount event
  // useEffect(()=> ()=> {
  //   scanner !== null && scanner.clear()
  // }, [])

  useEffect(() => {
    const newScanner = createScanner(setInfo)
    newScanner.render()

    setScanner(newScanner)
  }, [getConfig().pause, getConfig().box, getConfig().fps])

  const toggleType = () => {
    const newType = getConfig().type === AttendanceMovementType.In ? AttendanceMovementType.Out : AttendanceMovementType.In
    setConfig({ type: newType })
    setCurrent({...current, type: newType})
  }

  return (
    <Box sx={{ display:'flex', justifyContent:'center',width:'100%',height:'100%'}}>
      <Box sx={{ width: '100%', maxWidth: '750px',height:'fit-content',position: 'relative' }}>
        <ScannerBox id='reader' />
        <Box sx={{ display: 'flex', position: 'absolute',gap: 2,top: 5, right: 5}}>
          <PageConfig open={current.open} toggle={()=>setCurrent({...current,open:!current.open})} />
          <Link to='/attendance/create'>
            <IconButton>
              <Close sx={{fontSize: '1.5em', color: 'white', ':hover':{ backgroundColor:'rgba(0,0,0,.1)' }, }} />
            </IconButton>
          </Link>
        </Box>
        { info.status === ScanStatus.Success && <StatusStyled>STD: {info.data}</StatusStyled> }
        <Box sx={{ position: 'absolute', bottom: 5, width: '100%' }}>
          <FormControl component='form' fullWidth onChange={toggleType}>
            <RadioGroup
              value={current.type}
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

export default CreateByScan 
