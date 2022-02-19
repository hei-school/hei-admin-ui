import { render, screen } from '@testing-library/react'
import { TestContext } from 'ra-test'
import { DataProviderContext } from 'ra-core'
import { ThemeProvider } from '@material-ui/styles'

const dataAsList = [
  { id: 'student1', ref: 'ref1', first_name: 'first1', last_name: 'last1' },
  { id: 'student2', ref: 'ref2', first_name: 'first2', last_name: 'last2' }
]

const getStudentsMock = jest.fn().mockReturnValue(
  Promise.resolve({
    data: dataAsList
  })
)

const dataAsListToObj = dataAsList => {
  let obj = {}
  for (const dataItem of dataAsList) {
    obj[dataItem.id] = dataItem
  }
  return obj
}

const dataAsListToArray = dataAsList => {
  let array = []
  for (const dataItem of dataAsList) {
    array.push(dataItem.id)
  }
  return array
}

jest.doMock('aws-amplify')
jest.doMock('../providers/api', () => ({
  usersApi: () => ({
    getStudents: getStudentsMock
  })
}))
const dataProvider = require('../providers/dataProvider').default

jest.doMock('ra-core', () => ({
  ...jest.requireActual('ra-core'),
  useListContext: () => ({
    basePath: '/students',
    currentSort: {
      field: 'dummy',
      order: 'dummy'
    },
    data: dataAsListToObj(dataAsList),
    defaultTitle: 'Étudiants',
    displayedFilters: {},
    error: null,
    exporter: jest.fn(),
    filter: {},
    filterValues: {},
    hasCreate: false,
    hideFilter: jest.fn(),
    ids: dataAsListToArray(dataAsList),
    loaded: true,
    loading: false,
    onSelect: jest.fn(),
    onToggleItem: jest.fn(),
    onUnselectItems: jest.fn(),
    page: 1,
    perPage: 2,
    refetch: jest.fn(),
    resource: 'students',
    selectedIds: [],
    setFilters: jest.fn(),
    setPage: jest.fn(),
    setPerPage: jest.fn(),
    setSort: jest.fn(),
    showFilter: jest.fn(),
    total: Number.MAX_SAFE_INTEGER
  })
}))

const StudentList = require('../operations/students/StudentList').default

describe('StudentList', () => {
  it('shows one page if two students', () => {
    render(
      <TestContext enableReducers>
        <DataProviderContext.Provider value={dataProvider}>
          <ThemeProvider theme={require('../haTheme').mainTheme}>
            <StudentList resource='students' basePath='dummy' />
          </ThemeProvider>
        </DataProviderContext.Provider>
      </TestContext>
    )

    expect(getStudentsMock).toHaveBeenCalledWith(
      //pagination
      1,
      10,
      // filters
      undefined,
      undefined,
      undefined
    )
    screen.getByText(/Page :\s+1/)
    screen.getByText(/Taille :\s+2/)
    screen.getByText('first1')
    screen.getByText('last1')
    screen.getByText('first2')
    screen.getByText('last2')
    expect(screen.queryByText('Précédent')).toBeNull()
  })
})
