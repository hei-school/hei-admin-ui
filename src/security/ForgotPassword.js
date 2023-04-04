import React, { useState } from 'react'
import { checkPassword, CustomTextField, CustomSubmitButton } from './utils'
import authProvider from '../providers/authProvider'
import { useNotify } from 'react-admin'

const ForgotPassword = ({ username, setOpenModal }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')

  const notify = useNotify()

  const handlePassword = e => setPassword(e.target.value)
  const handleConfirmPassword = e => setConfirmPassword(e.target.value)
  const handleCode = e => setCode(e.target.value)

  const forgotPasswordSumbmit = () => {
    authProvider
      .forgotPasswordSubmit(username, code, password)
      .then(() => {
        setOpenModal(false)
      })
      .catch(() => notify(`Une erreur s'est produite`, { type: 'error', autoHideDuration: '2000' }))
  }

  const handleSubmit = () => {
    if (checkPassword(password, confirmPassword) == true) {
      return forgotPasswordSumbmit()
    } else {
      notify(checkPassword(password, confirmPassword), { type: 'error', autoHideDuration: '10000' })
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
      <CustomTextField
        validator={code === ''}
        label='Code de vérification'
        placeholder='Code de vérification'
        onChange={handleCode}
        type='password'
        data-testid='code_input'
      />
      <CustomTextField
        validator={password === ''}
        label='Mot de passe'
        placeholder='Nouveau mot de passe'
        onChange={handlePassword}
        type='password'
        data-testid='password_input'
      />
      <CustomTextField
        validator={confirmPassword === ''}
        label='Confirmation du mot de passe'
        placeholder='Confirmer votre mot de passe'
        onChange={handleConfirmPassword}
        type='password'
        data-testid='confirm_password_input'
      />
      <CustomSubmitButton onClick={handleSubmit} text='RÉINITIALISER' />
    </form>
  )
}
export default ForgotPassword
