import { render, screen } from '@testing-library/react'

jest.doMock('aws-amplify')
jest.doMock('../providers/authProvider', () => ({
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.resolve(),
  getIdentity: () => Promise.resolve('whoami.id'),
  getPermissions: () => Promise.resolve(['TEACHER']),
  getCachedAuthConf: jest.fn(),
  isTemporaryPassword: () => false
}))
const App = require('../App').default

describe('App', () => {
  it('is no longer on login page if authentication succeeded', async () => {
    render(<App />)

    expect(screen.queryByText('Connexion')).toBeNull() // we are not asked to connect anymore
  })
})
