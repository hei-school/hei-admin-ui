import { Route } from 'react-router-dom'
import { Admin, Resource } from 'react-admin'

import polyglotI18nProvider from 'ra-i18n-polyglot'
import frenchMessages from 'ra-language-french'

import dataProvider from './providers/dataProvider'
import authProvider from './providers/authProvider.ts'

import profile from './operations/profile'
import students from './operations/students'
import teachers from './operations/teachers'
import fees from './operations/fees'
import studentGrades from './operations/studentGrades'

import MyLayout from './HaLayout'
import HaLoginPage from './security/LoginPage'
import { mainTheme } from './haTheme'

const App = () => (
  <Admin
    title='HEI Admin'
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={polyglotI18nProvider(() => frenchMessages, 'fr')}
    theme={mainTheme}
    loginPage={HaLoginPage}
    layout={MyLayout}
    customRoutes={[
      <Route key='profile' exact path='/profile' component={profile.show} />,
      <Route key='fees' exact path='/students/:studentId/fees' component={fees.list} />,
      <Route key='fees' exact path='/students/:studentId/fees/create' component={fees.create} />,
      <Route key='fees' exact path='/students/:studentId/fees/:feeId/show' component={fees.show} />
    ]}
  >
    {permissions => {
      // https://marmelab.com/react-admin/doc/3.4/Authorization.html#restricting-access-to-resources-or-views
      const permission = permissions[0]
      return [
        <Resource name='profile' />,

        permission === 'MANAGER' && <Resource name='students' {...students} />,
        permission === 'MANAGER' && <Resource name='teachers' {...teachers} />,

        permission === 'STUDENT' && <Resource name='student-grades' {...studentGrades} />,

        (permission === 'MANAGER' || permission === 'STUDENT') && <Resource name='fees' {...fees} />,

        permission === 'TEACHER' && <Resource name='students' options={{ label: 'Étudiants' }} list={students.list} show={students.show} />
      ]
    }}
  </Admin>
)

export default App
