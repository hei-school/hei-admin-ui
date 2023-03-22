import { useState } from 'react'
import authProvider from '../providers/authProvider'
import { Typography } from '@mui/material'
import { CustomTextField, CustomSubmitButton } from './utils'

const ConfirmForgotPassword = ({ setUsername, setOpenSubmitModal, setOpenModal }) => {
  const [email, setEmail] = useState('')
  const handleEmailChange = e => setEmail(e.target.value)

  const sendEmail = () => {
    setUsername(email)
    authProvider.forgotPassword(email)
    setOpenModal(false)
    setOpenSubmitModal(true)
  }
  return (
    <div>
      <Typography
        variant='h7'
        sx={{
          margin: '0.75vw'
        }}
      >
        Un mail de confirmation avec un code vous sera envoyé
      </Typography>
      <CustomTextField placeholder='Votre mail ici' onChange={handleEmailChange} type='email' />
      <CustomSubmitButton onClick={sendEmail} text='ENVOYER' />
    </div>
  )
}
export default ConfirmForgotPassword
