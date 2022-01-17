import { Admin, Resource } from 'react-admin'
import { Route } from 'react-router-dom'

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
import { mainTheme } from './haTheme'
import CompletePassword from './operations/security/CompletePassword'

const App = () => {
  return (
    <Admin
      title='HEI Admin'
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={polyglotI18nProvider(() => frenchMessages, 'fr')}
      theme={mainTheme}
      layout={MyLayout}
      customRoutes={[
        <Route key='profile' exact path='/profile' component={profile.show} />,
        <Route key='complete-password' exact path='/complete-password' component={CompletePassword} />
      ]}
    >
      {permissions => {
        // https://marmelab.com/react-admin/doc/3.4/Authorization.html#restricting-access-to-resources-or-views
        const permission = permissions[0]
        return [
          permission === 'MANAGER' && <Resource name='students' {...students} />,
          permission === 'MANAGER' && <Resource name='teachers' {...teachers} />,

          permission === 'TEACHER' && <Resource name='students' options={{ label: 'Etudiants' }} list={students.list} show={students.show} />,

          <Resource name='profile' />,

          permission === 'STUDENT' && <Resource name='fees' {...fees} />,
          permission === 'STUDENT' && <Resource name='student-grades' {...studentGrades} />
        ]
      }}
    </Admin>
  )
}

export default App
