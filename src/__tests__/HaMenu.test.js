describe('HaMenu', () => {
  let renderTestedComponent
  let userEvent
  let screen

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()

    // Jest requires modules to be reimported between tests
    // so that mocks work properly https://github.com/facebook/jest/issues/3236
    const React = require('react')
    userEvent = require('@testing-library/user-event').default
    const RTL = require('@testing-library/react')
    screen = RTL.screen

    renderTestedComponent = (initTestedComponent, useAsyncReturn) => {
      jest.doMock('aws-amplify')
      jest.doMock('react-async', () => ({
        useAsync: jest.fn().mockReturnValue(useAsyncReturn)
      }))
      // /!\ Module with mocked dependencies MUST be loaded only when mocks have been set
      const TestedComponent = initTestedComponent()
      const { TestContext } = require('ra-test')
      const { ThemeProvider } = require('@material-ui/styles')
      RTL.render(
        <TestContext>
          <ThemeProvider theme={require('../haTheme').mainTheme}>
            <TestedComponent />
          </ThemeProvider>
        </TestContext>
      )
    }
  })

  afterEach(() => {
    // "Failing to call cleanup could result in a memory leak and tests which are not idempotent"
    // https://testing-library.com/docs/react-testing-library/api/#cleanup
    require('@testing-library/react').cleanup()
  })

  it('displays correct student menu', async () => {
    const initTestedComponent = () => require('../HaMenu').default
    const useAsyncReturn = { data: { role: 'STUDENT' }, isPending: false }

    renderTestedComponent(initTestedComponent, useAsyncReturn)

    screen.getAllByText('Mon profil')
    screen.getAllByText('Frais')
    screen.getAllByText('Notes')
  })

  it('displays correct teacher menu', async () => {
    const initTestedComponent = () => require('../HaMenu').default
    const useAsyncReturn = { data: { role: 'TEACHER' }, isPending: false }

    renderTestedComponent(initTestedComponent, useAsyncReturn)

    expect(screen.findByText('Mon profil')).not.toBeNull
    screen.getAllByText('Étudiants')
  })

  it('displays correct manager menu', async () => {
    const initTestedComponent = () => require('../HaMenu').default
    const useAsyncReturn = { data: { role: 'MANAGER' }, isPending: false }

    renderTestedComponent(initTestedComponent, useAsyncReturn)

    screen.getAllByText('Mon profil')
    screen.getAllByText('Étudiants')
    screen.getAllByText('Enseignants')
  })
})
