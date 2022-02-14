import { render, screen } from '@testing-library/react'
import { TestContext } from 'ra-test'
import { DataProviderContext } from 'ra-core'
import { ThemeProvider } from '@material-ui/styles'

import StudentList from '../operations/students/StudentList'

jest.doMock('aws-amplify')
jest.doMock('../providers/api', () => ({
  usersApi: {
    getStudents: () =>
      Promise.resolve({
        data: []
      })
  }
}))
const dataProvider = require('../providers/dataProvider').default

describe('StudentList', () => {
  it('shows nothing if no student', async () => {
    render(
      <TestContext>
        <ThemeProvider theme={require('../haTheme').mainTheme}>
          <DataProviderContext.Provider value={dataProvider}>
            <StudentList resource='students' basePath='dummy' />
          </DataProviderContext.Provider>
        </ThemeProvider>
      </TestContext>
    )

    screen.getByText(/Page :\s+1/)
    screen.getByText(/Taille :\s+0/)
    expect(screen.queryByText('Précédent')).toBeNull()
  })
})
