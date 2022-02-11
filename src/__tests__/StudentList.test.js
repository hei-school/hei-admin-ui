describe('StudentList', () => {
  let renderTestedComponent
  let userEvent
  let screen

  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()

    const React = require('react')
    userEvent = require('@testing-library/user-event').default
    const RTL = require('@testing-library/react')
    screen = RTL.screen

    renderTestedComponent = (initTestedComponent, getStudentsReturnData) => {
      jest.doMock('aws-amplify')
      jest.doMock('../providers/api', () => ({
        usersApi: {
          getStudents: () => Promise.resolve({ data: getStudentsReturnData })
        }
      }))
      const TestedComponent = initTestedComponent()
      const { TestContext } = require('ra-test')
      const { DataProviderContext } = require('ra-core')
      const dataProvider = require('../providers/dataProvider').default
      const { ThemeProvider } = require('@material-ui/styles')
      RTL.render(
        <TestContext>
          <ThemeProvider theme={require('../haTheme').mainTheme}>
            <DataProviderContext.Provider value={dataProvider}>
              <TestedComponent resource='students' basePath='dummy' />
            </DataProviderContext.Provider>
          </ThemeProvider>
        </TestContext>
      )
    }
  })

  afterEach(() => {
    require('@testing-library/react').cleanup()
  })

  it('shows nothing if no student', async () => {
    const initTestedComponent = () => require('../operations/students/StudentList').default
    const getStudentsReturnData = []

    renderTestedComponent(initTestedComponent, getStudentsReturnData)

    screen.getByText(/Page :\s+1/)
    screen.getByText(/Taille :\s+0/)
    expect(screen.queryByText('Précédent')).toBeNull()
  })

  it.skip('shows one page if two students', async () => {
    const initTestedComponent = () => require('../operations/students/StudentList').default
    const getStudentsReturnData = [
      { id: 'student1', name: 'name1' },
      { id: 'student2', name: 'name2' }
    ]

    renderTestedComponent(initTestedComponent, getStudentsReturnData)

    screen.getByText(/Page :\s+1/)
    screen.getByText(/Taille :\s+2/)
    expect(screen.queryByText('Précédent')).toBeNull()
  })
})
