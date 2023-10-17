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

function QrPageConfig({open,toggle}) {
  const { getConfig, setConfig, defaultConfig } = qrcode
  const [newConfig, setNewConfig] = useState(getConfig());

  const toggleShowConfig = ()=>{
    setNewConfig(getConfig())
    toggle()
  }

  const handlerNewConfig = event => {
    const { name, value } = event.target
    setNewConfig({ ...newConfig, [name]: value })
  }

  const changeQrConfig = configValue => {
    setConfig(configValue)
    toggleShowConfig();
  }

  return (
    <>
      <IconButton onClick={toggleShowConfig}>
        <Settings sx={{fontSize:'1.3em',color:'white' }} />
      </IconButton>
      <Dialog onClose={toggleShowConfig} sx={{ width: '100%' }} open={open}>
        <DialogTitle sx={{ display: 'flex', p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'rgba(0,0,0,.8)', fontSize: '1em', fontWeight: 'bold', textAlign: 'center' }}>
            Paramètre du scanner
          </Typography>
          <IconButton onClick={toggleShowConfig}>
            <Close sx={{ color: 'rgba(0,0,0,.8)'}} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '300px', px: 2 }}>
          <FormGroup>
            <InputLabel>Fps :</InputLabel>
            <Input
              size='large'
              value={newConfig.fps}
              onChange={handlerNewConfig}
              placeholder='Ex: 30 (pour 30fps)'
              type='number'
              id='fps'
              name='fps'
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>Délai d'une pause :</InputLabel>
            <Input
              size='large'
              value={newConfig.pause}
              onChange={handlerNewConfig}
              placeholder='Ex: 2 (pour 2s)'
              type='number'
              id='pause'
              name='pause'
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>Taille du scanner:</InputLabel>
            <Input
              size='large'
              value={newConfig.box}
              onChange={handlerNewConfig}
              placeholder='Ex: 100 (pour 100*100)'
              type='number'
              name='box'
              id='box'
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>Lieu: </InputLabel>
            <Select id='place' name='place' value={newConfig.place} variant='outlined' autoWidth size='small' onChange={handlerNewConfig}>
              {AvailablePlace.map((place, id) => (
                <MenuItem key={id} value={place.value}>
                  {place.label}
                </MenuItem>
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
