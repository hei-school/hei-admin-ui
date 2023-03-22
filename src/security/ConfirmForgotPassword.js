import { useState } from 'react'
import authProvider from '../providers/authProvider'
import { Typography } from '@mui/material'
import { Button } from 'react-admin'
import { indigo } from '@mui/material/colors'
import { CustomTextField } from './utils'

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center',
        margin: 'auto'
      }}
    >
      <Typography
        variant='h7'
        sx={{
          margin: '0.75vw'
        }}
      >
        Un mail de confirmation avec un code vous sera envoyé
      </Typography>
      <CustomTextField placeholder='Votre mail ici' onChange={handleEmailChange} type='text' />
      <Button
        onClick={sendEmail}
        sx={{
          backgroundColor: indigo[800],
          width: '300px',
          color: '#FFFF',
          padding: '0.5vw',
          margin: '0.75vw'
        }}
      >
        ENVOYER
      </Button>
    </div>
  )
}
export default ConfirmForgotPassword
