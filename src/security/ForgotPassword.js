import React, { useState } from 'react'
import { submit, CustomTextField, CustomSubmitButton } from './utils'
import authProvider from '../providers/authProvider'

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
      <CustomSubmitButton onClick={handleSubmit} text='RÉINITIALISER' />
    </form>
  )
}
export default ForgotPassword
