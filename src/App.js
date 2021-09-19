import { Route } from 'react-router-dom'

import { Admin, Resource, ShowGuesser } from 'react-admin'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import frenchMessages from 'ra-language-french'

import dataProvider from './providers/dataProvider'

import profileReducer from './redux/profileReducer'

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
      dataProvider={dataProvider}
      customReducers={{ profile: profileReducer }}
      i18nProvider={i18nProvider}
      theme={mainTheme}
      customRoutes={[
        <Route key='profile' path='/profile' component={profile.show} />,

        // TODO(courses-ShowGuesser): might be irrelevant when not using guesser anymore
        <Route key='courses' path='/courses' component={ShowGuesser} />
      ]}
      appLayout={MyLayout}
    >
      <Resource name='profile' />

      <Resource name='students' {...students} />
      <Resource name='teachers' {...teachers} />

      <Resource name='student-timetable' {...studentTimetable} />
      <Resource name='student-grades' {...studentGrades} />

      <Resource name='teacher-timetable' {...teacherTimetable} />
      <Resource name='teacher-grades' {...teacherGrades} />

      {
        // TODO(courses-ShowGuesser)
      }
      <Resource name='courses' />
    </Admin>
  )
}
export default App
