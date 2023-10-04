import React, { useState } from 'react'
import { Typography, Select, MenuItem, InputLabel, Button, Dialog, Input, Box, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import { getQrConfig, qrDefaultConfig, setQrConfig } from './utils'
import { AVAILABLE_PLACE } from '../../conf'
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

function QrPageConfig({openConfig, setOpenConfig}) {
  const [newConfig, setNewConfig] = useState(getQrConfig());

  const toggleShowConfig = ()=>{
    setNewConfig(getQrConfig())
    setOpenConfig(!openConfig)
  }

  const handlerNewConfig = event => {
    const { name, value } = event.target
    setNewConfig({ ...newConfig, [name]: value })
  }

  const changeQrConfig = configValue => {
    setQrConfig(configValue)
    toggleShowConfig();
  }

  return (
    <>
      <Button variant='text' sx={{ p: 0 }} onClick={toggleShowConfig}>
        <SettingsIcon sx={{ fontSize: '32px', pb: '3px', color:'white' }} />
      </Button>
      <Dialog onClose={toggleShowConfig} sx={{ width: '100%' }} open={openConfig}>
        <DialogTitle sx={{ display: 'flex', p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: 'rgba(0,0,0,.8)', fontSize: '1em', fontWeight: 'bold', textAlign: 'center' }}>
            Paramètre du scanner
          </Typography>
          <Button onClick={toggleShowConfig}>
            <CloseIcon sx={{ color: 'rgba(0,0,0,.8)', fontSize: '30px' }} />
          </Button>
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
              value={newConfig.pauseDelay}
              onChange={handlerNewConfig}
              placeholder='Ex: 2 (pour 2s)'
              type='number'
              id='pauseDelay'
              name='pauseDelay'
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>Taille du scanner:</InputLabel>
            <Input
              size='large'
              value={newConfig.boxSize}
              onChange={handlerNewConfig}
              placeholder='Ex: 100 (pour 100*100)'
              type='number'
              name='boxSize'
              id='boxSize'
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>Lieu: </InputLabel>
            <Select id='place' name='place' value={newConfig.place} variant='outlined' autoWidth size='small' onChange={handlerNewConfig}>
              {AVAILABLE_PLACE.map((place, id) => (
                <MenuItem key={id} value={place}>
                  {place}
                </MenuItem>
              ))}
            </Select>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => changeQrConfig(qrDefaultConfig)} size='small' variant='outlined' color='info'>
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
