import { Auth } from 'aws-amplify'
import { useRedirect } from 'react-admin'
import { useState } from 'react'

const CompletePassword = () => {
  const redirect = useRedirect()
  const [password, setPassword] = useState()

  const handleSubmit = event => {
    event.preventDefault()
    Auth.completeNewPassword(user, password)
  }

  const user = Auth.currentAuthenticatedUser()
  if (user.challengeName !== 'NEW_PASSWORD_REQUIRED') {
    redirect('/')
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>Nouveau mot de passe :</label>
      <input type='password' onChange={e => setPassword(e.target.value)} value={password} name='password' />

      <input type='submit' value='Valider' />
    </form>
  )
}
export default CompletePassword
