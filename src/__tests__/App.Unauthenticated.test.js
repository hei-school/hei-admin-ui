import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

jest.doMock('aws-amplify')
jest.doMock('../providers/authProvider', () => ({
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.reject(),
  getIdentity: () => Promise.reject(),
  getPermissions: () => Promise.reject(),
  getCachedAuthConf: jest.fn(),
  isNewPassword: () => false
}))
const App = require('../App').default

describe('App', () => {
  it('requires login information to be filled', async () => {
    render(<App />)
    userEvent.click(await screen.findByText('Connexion'))

    const errors = screen.getAllByText('Ce champ est requis')
    expect(errors).toHaveLength(2) // one for username and one for password
  })

  it('remains on login page if authentication failed', async () => {
    render(<App />)
    userEvent.type(await screen.findByLabelText('Identifiant'), 'dummy')
    userEvent.type(await screen.findByLabelText('Mot de passe'), 'dummy')
    userEvent.click(await screen.findByText('Connexion'))

    screen.getByText('Connexion') // we are still asked to connect
  })
})
