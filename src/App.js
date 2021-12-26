import { Admin } from 'react-admin'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import frenchMessages from 'ra-language-french'

import { Resource } from './rbac/AccessControlled'

import dataProvider from './providers/dataProvider'

import profileReducer from './redux/profileReducer'

import profile from './operations/profile'
import students from './operations/students'
import teachers from './operations/teachers'
import fees from './operations/fees'
import studentGrades from './operations/studentGrades'

import MyLayout from './HaLayout'
import { mainTheme } from './haTheme'

const App = () => {
  return (
    <Admin
      title='HEI Admin'
      dataProvider={dataProvider}
      customReducers={{ profile: profileReducer }}
      i18nProvider={polyglotI18nProvider(() => frenchMessages, 'fr')}
      theme={mainTheme}
      layout={MyLayout}
    >
      <Resource role='manager' name='students' {...students} />
      <Resource role='manager' name='teachers' {...teachers} />

      <Resource role='student' name='profile' {...profile} />
      <Resource role='student' name='fees' {...fees} />
      <Resource role='student' name='student-grades' {...studentGrades} />
    </Admin>
  )
}
export default App
