import { Auth } from '@aws-amplify/auth'
import { useState } from 'react'

const CompletePassword = () => {
  const user = JSON.parse(localStorage.getItem('CognitoUser'))
  const [password, setPassword] = useState()

  const handleSubmit = event => {
    event.preventDefault()
    Auth.completeNewPassword(user, password)
  }

  return (
    <center>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Nouveau mot de passe :</label>
          <input type='password' onChange={e => setPassword(e.target.value)} value={password} name='password' />

          <input type='submit' value='Valider' />
        </form>
      </div>
    </center>
  )
}
export default CompletePassword
