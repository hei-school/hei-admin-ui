import * as React from "react";
import { Admin, Resource } from "react-admin"
import jsonServerProvider from "ra-data-json-server"
import { mainTheme } from './hei-theme'
import Dashboard from './dashboard'
import GroupList from './groups'
import CourseList from './courses'
import TeacherList from './teachers'
import { StudentList, StudentShow } from './students'
import  SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import BookIcon from '@material-ui/icons/Book';
import SchoolIcon from '@material-ui/icons/School';
import WorkIcon from '@material-ui/icons/Work';

const dataProvider = jsonServerProvider("https://virtserver.swaggerhub.com/hei-admin/hei-admin_api/1.0");
const App = () => (
    <Admin dashboard={Dashboard} theme={mainTheme} dataProvider={dataProvider}>
        <Resource name="teachers" icon={WorkIcon} list={TeacherList} />
        <Resource name="groups" icon={SupervisedUserCircleIcon} list={GroupList} />
        <Resource name="courses" icon={BookIcon} list={CourseList} />
        <Resource name="students" icon={SchoolIcon} list={StudentList} show={StudentShow} />
    </Admin>
);

export default App;