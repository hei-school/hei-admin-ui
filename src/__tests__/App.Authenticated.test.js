import { render, screen } from '@testing-library/react'

jest.doMock('aws-amplify')
jest.doMock('../providers/authProvider', () => ({
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.resolve(),
  getIdentity: () => Promise.resolve('whoami.id'),
  getPermissions: () => Promise.resolve(['TEACHER']),
  whoami: () => Promise.resolve({ id: 'teacher1', role: 'TEACHER', bearer: 'bearer' }),
  getCachedAuthConf: jest.fn(),
  getCachedRole: () => 'TEACHER',
  isTemporaryPassword: () => false
}))
jest.doMock('../providers/api', () => ({
  usersApi: () => ({
    getTeacherById: jest.fn().mockReturnValue(
      Promise.resolve({
        data: { id: 'teacher1', ref: 'ref1', first_name: 'first1', last_name: 'last1' }
      })
    )
  })
}))
const App = require('../App').default

describe('App', () => {
  it('is no longer on login page if authentication succeeded', async () => {
    render(<App />)

    expect(screen.queryByText('Connexion')).toBeNull() // we are not asked to connect anymore
  })
})
