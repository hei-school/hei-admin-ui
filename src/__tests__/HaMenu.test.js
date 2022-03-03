describe('HaMenu', () => {
  let renderTestedComponent

  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    renderTestedComponent = (initTestedComponent, useAsyncReturn) => {
      jest.doMock('aws-amplify')
      jest.doMock('react-async', () => ({
        useAsync: jest.fn().mockReturnValue(useAsyncReturn)
      }))
      // /!\ Module with mocked dependencies MUST be loaded only when mocks have been set
      const TestedComponent = initTestedComponent()
      const { render } = require('@testing-library/react')
      const { TestContext } = require('ra-test')
      const { ThemeProvider } = require('@material-ui/styles')
      return render(
        <TestContext>
          <ThemeProvider theme={require('../haTheme').mainTheme}>
            <TestedComponent />
          </ThemeProvider>
        </TestContext>
      )
    }
  })

  it('displays correct student menu', async () => {
    const initTestedComponent = () => require('../menu/HaMenu').default
    const useAsyncReturn = { data: { role: 'STUDENT' }, isPending: false }

    const { getAllByText } = renderTestedComponent(initTestedComponent, useAsyncReturn)

    getAllByText('Mon profil')
    getAllByText('Frais')
    getAllByText('Notes')
  })

  it('displays correct teacher menu', async () => {
    const initTestedComponent = () => require('../menu/HaMenu').default
    const useAsyncReturn = { data: { role: 'TEACHER' }, isPending: false }

    const { getAllByText } = renderTestedComponent(initTestedComponent, useAsyncReturn)

    getAllByText('Mon profil')
    getAllByText('Étudiants')
  })

  it('displays correct manager menu', async () => {
    const initTestedComponent = () => require('../menu/HaMenu').default
    const useAsyncReturn = { data: { role: 'MANAGER' }, isPending: false }

    const { getAllByText } = renderTestedComponent(initTestedComponent, useAsyncReturn)

    getAllByText('Mon profil')
    getAllByText('Étudiants')
    getAllByText('Enseignants')
  })
})
