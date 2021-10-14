import { Route } from 'react-router-dom'

import { Admin, Resource as RaResource, ShowGuesser } from 'react-admin'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import frenchMessages from 'ra-language-french'

import { Resource } from './rbac/AccessControlled'

import dataProvider from './providers/dataProvider'

import profileReducer from './redux/profileReducer'

import Dashboard from './dashboard/Dashboard'
import profile from './operations/profile'
import students from './operations/students'
import teachers from './operations/teachers'
import studentTimetable from './operations/studentTimetable'
import studentGrades from './operations/studentGrades'
import teacherTimetable from './operations/teacherTimetable'
import teacherGrades from './operations/teacherGrades'

import MyLayout from './HaLayout'
import { mainTheme } from './haTheme'

const i18nProvider = polyglotI18nProvider(() => frenchMessages, 'fr')
const App = () => {
  return (
    <Admin
      title='HEI Admin'
      dashboard={Dashboard}
      dataProvider={dataProvider}
      customReducers={{ profile: profileReducer }}
      i18nProvider={i18nProvider}
      theme={mainTheme}
      customRoutes={[
        <Route key='profile' path='/profile' component={profile.show} />,

        // TODO: remove when authentication is implemented
        // so that Dashboard is rendered with the usual layout
        // AND accessible for authenticated users only
        <Route exact path='/' component={Dashboard} noLayout />,

        // TODO(courses-ShowGuesser): might be irrelevant when not using guesser anymore
        <Route key='courses' path='/courses' component={ShowGuesser} />
      ]}
      appLayout={MyLayout}
    >
      <RaResource name='profile' />

      <Resource role='manager' name='students' {...students} />
      <Resource role='manager' name='teachers' {...teachers} />

      <Resource role='student' name='student-timetable' {...studentTimetable} />
      <Resource role='student' name='student-grades' {...studentGrades} />

      <Resource role='teacher' name='teacher-timetable' {...teacherTimetable} />
      <Resource role='teacher' name='teacher-grades' {...teacherGrades} />

      {
        // TODO(courses-ShowGuesser)
      }
      <RaResource name='courses' />
      <RaResource name='teachers' />
    </Admin>
  )
}
export default App
