import React, { useState } from 'react'
import authProvider from '../providers/authProvider'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  textInput: {
    width: '100%',
    backgroundColor: '#E8F0FE',
    padding: '10px  0px 10px 0px',
    marginTop: '5px',
    marginBottom: '5px',
    border: '0',
    outline: '0',
    borderBottom: '1px solid #000000'
  },
  submitInput: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: '1.4em',
    fontFamily: 'Roboto,Helvetica, sans-serif',
    textTransform: 'uppercase',
    padding: '10px',
    width: '100%',
    backgroundColor: '#303F9F',
    border: '0',
    borderRadius: '4px'
  },
  formWrapper: {
    opacity: '0.9',
    height: '245px',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    justifyItems: 'center',
    textAlign: 'left'
  },
  formGroup: {
    width: '100%'
  }
})

const CustomLabel = text => {
  return <label style={{ textAlign: 'left', color: '#BDBDBD' }}>{text}</label>
}

const CompletePasswordForm = () => {
  const classes = useStyles()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const handleSubmit = event => {
    if (document.getElementById('password').value === '') {
      alert('Le mot de passe ne doit pas rester vide !', 'error')
    } else if (document.getElementById('password').value !== document.getElementById('confirm-password').value) {
      alert('Les mots de passe ne correspondent pas !', 'error')
    } else {
      event.preventDefault()
      authProvider.setNewPassword(password)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.formWrapper}>
        <div style={{ color: '#000000', textAlign: 'center', fontWeight: 'bold', fontSize: '1.4em' }}>Première connexion ?</div>
        <hr />
        <div className={classes.formGroup}>
          {CustomLabel('Entrez votre nouveau mot de passe')}
          <input className={classes.textInput} type='password' onChange={e => setPassword(e.target.value)} value={password} id='password' />
        </div>
        <div className={classes.formGroup}>
          {CustomLabel('Confirmez votre nouveau mot de passe')}
          <input
            className={classes.textInput}
            type='password'
            onChange={e => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            id='confirm-password'
          />
        </div>
        <div className={classes.formGroup}>
          <input value='Enregistrer' type='submit' className={classes.submitInput} />
        </div>
      </div>
    </form>
  )
}
const CompletePasswordPage = () => {
  return (
    <center style={{ paddingTop: '10%' }}>
      <CompletePasswordForm />
    </center>
  )
}
export default CompletePasswordPage
