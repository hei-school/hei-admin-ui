import * as React from 'react'
import { Admin, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import mainTheme from './hei-theme'
import Dashboard from './dashboard'
import GroupList from './groups'
import CourseList from './courses'
import TeacherList from './teachers'
import { StudentList, StudentShow } from './students'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
import BookIcon from '@material-ui/icons/Book'
import SchoolIcon from '@material-ui/icons/School'
import WorkIcon from '@material-ui/icons/Work'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Amplify from 'aws-amplify'
import awsExports from './aws-exports'

Amplify.configure(awsExports)

const dataProvider = jsonServerProvider('https://virtserver.swaggerhub.com/hei-admin/hei-admin_api/1.0')
const App = () => (
  <Admin dashboard={Dashboard} theme={mainTheme} dataProvider={dataProvider}>
    <Resource name='teachers' options={{ label: 'Enseignants' }} icon={WorkIcon} list={TeacherList} />
    <Resource name='groups' options={{ label: 'Groupes' }} icon={SupervisedUserCircleIcon} list={GroupList} />
    <Resource name='courses' options={{ label: 'Cours' }} icon={BookIcon} list={CourseList} />
    <Resource name='students' options={{ label: 'Etudiants' }} icon={SchoolIcon} list={StudentList} show={StudentShow} />
  </Admin>
)

export default withAuthenticator(App)
