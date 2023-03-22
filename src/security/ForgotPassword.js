import React, { useState } from 'react'
import { submit, CustomTextField } from './utils'
import authProvider from '../providers/authProvider'
import { Button } from 'react-admin'
import { indigo } from '@mui/material/colors'

const ForgotPassword = ({ username, setOpenModal }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const handlePassword = e => setPassword(e.target.value)
  const handleConfirmPassword = e => setConfirmPassword(e.target.value)
  const handleCode = e => setCode(e.target.value)
  const forgotPasswordSumbmit = () => authProvider.forgotPasswordSubmit(username, code, password)
  const handleSubmit = () => {
    setOpenModal(false)
    if (submit(password, confirmPassword)) {
      return forgotPasswordSumbmit()
    }
  }
  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center',
        margin: 'auto'
      }}
    >
      <CustomTextField placeholder='Code de vérification' onChange={handleCode} type='password' />
      <CustomTextField placeholder='Nouveau mot de passe' onChange={handlePassword} type='password' />
      <CustomTextField placeholder='Confirmer votre mot de passe' onChange={handleConfirmPassword} type='password' />
      <Button
        onClick={handleSubmit}
        style={{
          backgroundColor: indigo[800],
          width: '300px',
          color: '#FFFF',
          padding: '0.5vw',
          margin: '0.75vw'
        }}
      >
        RÉINITIALISER
      </Button>
    </form>
  )
}
export default ForgotPassword
