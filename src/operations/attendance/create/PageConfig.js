import React, { useState } from 'react'
import { 
  Typography, 
  Select, 
  MenuItem, 
  InputLabel, 
  Button, 
  Dialog,
  IconButton,
  Input,
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material'
import { Settings,Close } from '@mui/icons-material'
import { qrcode, AvailablePlace } from './config'
import { styled } from '@mui/styles'

const FormGroup = styled('div')({
  width: '100%',
  display: 'flex',
  margin:'10px 0',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  gap: 2 
})

const ConfigInput = ({label, id, value, placeHolder, handler})=>(
  <FormGroup>
    <InputLabel sx={{fontSize: '15px'}}>{label} :</InputLabel>
    <Input
      size='large'
      value={value}
      onChange={handler}
      placeholder={placeHolder}
      sx={{fontSize: '15px', py: .2}}
      id={id}
      name={id}
    />
  </FormGroup>
)

function QrPageConfig({open,toggle}) {
  const { getConfig, setConfig, defaultConfig } = qrcode
  const [newConfig, setNewConfig] = useState(getConfig());

  const toggleShowConfig = ()=>{
    setNewConfig(getConfig())
    toggle()
  }
  
  const handlerNewConfig = event => {
    const { name, value } = event.target
    if( value === '' || name === 'place')
      setNewConfig({ ...newConfig, [name]: value})

    if(!isNaN(parseInt(value)))
      setNewConfig({ ...newConfig, [name]: parseInt(value)})
  }

  const changeQrConfig = configValue => {
    setConfig(configValue)
    toggleShowConfig();
  }
  
  const inputs = [
    { label: 'Fps', value: newConfig.fps, placeHolder: 'Ex: 30 (pour 30fps)', id: 'fps'},
    { label: 'Pause', value: newConfig.pause, placeHolder: 'Ex: 2 (pour 2s)', id: 'pause' },
    { label: 'Scanner', value: newConfig.box, placeHolder: 'Ex: 100 (pour 100px)', id: 'box' }
  ]

  return (
    <>
      <IconButton onClick={toggleShowConfig}>
        <Settings sx={{fontSize:'1.3em',color:'white' }} />
      </IconButton>
      <Dialog onClose={toggleShowConfig} sx={{ width: '100%' }} open={open}>
        <DialogTitle sx={{ display: 'flex', p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#232423', fontSize: '.9em', fontWeight: 'bold'}}>
            Paramètre du scanner
          </Typography>
          <IconButton onClick={toggleShowConfig}>
            <Close sx={{color:'#232423'}} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '300px', px: 2 }}>
          {inputs.map(el => <ConfigInput key={el.id} handler={handlerNewConfig} {...el}/>)}
          <FormGroup>
            <InputLabel>Lieu: </InputLabel>
            <Select id='place' name='place' value={newConfig.place} variant='outlined' autoWidth size='small' onChange={handlerNewConfig} sx={{fontSize: '15px'}}>
              {AvailablePlace.map((place, id) => (
                <MenuItem key={id} value={place.value} sx={{fontSize:'15px'}}> {place.label} </MenuItem>
              ))}
            </Select>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => changeQrConfig(defaultConfig)} size='small' variant='outlined' color='info'>
            Retablir
          </Button>
          <Button onClick={() => changeQrConfig(newConfig)} size='small' variant='outlined' color='primary'>
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default QrPageConfig
