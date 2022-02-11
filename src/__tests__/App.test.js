describe('App', () => {
  let renderTestedComponent
  let userEvent
  let screen

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    const React = require('react')
    userEvent = require('@testing-library/user-event').default
    const RTL = require('@testing-library/react')
    screen = RTL.screen

    renderTestedComponent = (initTestedComponent, isAuthenticated) => {
      jest.doMock('aws-amplify')
      jest.doMock('../providers/authProvider', () => ({
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => (isAuthenticated ? Promise.resolve() : Promise.reject()),
        getIdentity: () => (isAuthenticated ? Promise.resolve('whoami.id') : Promise.reject()),
        getPermissions: () => (isAuthenticated ? Promise.resolve(['whoami.role']) : Promise.reject()),
        getToken: () => Promise.resolve('dummy'),
        isNewPassword: () => false
      }))
      const TestedComponent = initTestedComponent()
      RTL.render(<TestedComponent />)
    }
  })

  afterEach(() => {
    require('@testing-library/react').cleanup()
  })

  it('requires login information to be filled', async () => {
    const initTestedComponent = () => require('../App').default
    const isAuthenticated = false

    renderTestedComponent(initTestedComponent, isAuthenticated)
    userEvent.click(await screen.findByText('Connexion'))

    const errors = screen.getAllByText('Ce champ est requis')
    expect(errors).toHaveLength(2) // one for username and one for password
  })

  it('remains on login page if authentication failed', async () => {
    const initTestedComponent = () => require('../App').default
    const isAuthenticated = false

    renderTestedComponent(initTestedComponent, isAuthenticated)
    userEvent.type(await screen.findByLabelText('Identifiant'), 'dummy')
    userEvent.type(await screen.findByLabelText('Mot de passe'), 'dummy')
    userEvent.click(await screen.findByText('Connexion'))

    expect(screen.findByText('Connexion')).not.toBeNull // we are still asked to connect
    expect(screen.findByText('Aller au contenu')).toBeNull // user content is still not visible to us
  })

  it('displays user menu if authentication succeeded', async () => {
    const initTestedComponent = () => require('../App').default
    const isAuthenticated = true

    renderTestedComponent(initTestedComponent, isAuthenticated)

    expect(screen.findByText('Connexion')).toBeNull // we are not asked to connect anymore
    expect(screen.findByText('Aller au contenu')).not.toBeNull // user content is now visible to us
  })
})
