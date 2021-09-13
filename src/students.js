import { Card, CardContent, Typography, withStyles } from '@material-ui/core'
import * as React from 'react'
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  ReferenceField,
  Show,
  ShowButton,
  useRecordContext,
  TabbedShowLayout,
  Tab,
  ArrayField,
  DateField
} from 'react-admin'
import Timetable from './timetable'

export const StudentList = props => (
  <List {...props}>
    <Datagrid rowClick='show'>
      <TextField source='ref' />
      <TextField source='first_name' label='Prénoms' />
      <TextField source='last_name' label='Noms' />
      <ReferenceField reference='groups' source='group.id' label='Groupe'>
        <TextField source='ref' />
      </ReferenceField>
      <ShowButton />
    </Datagrid>
  </List>
)

const Aside = () => {
  const record = useRecordContext()
  return (
    <Card>
      <ImageField source='ref' title='ref' />
      <CardContent>
        <Typography variant='h6'>À propos</Typography>
        {record && <Typography variant='body2'>Ref : {record.ref}</Typography>}
        {record && <Typography variant='body2'>Groupe : {record.group.ref}</Typography>}
        {record && <Typography variant='body2'>Prénoms : {record.first_name}</Typography>}
        {record && <Typography variant='body2'>Noms : {record.last_name}</Typography>}
      </CardContent>
    </Card>
  )
}

const FullArrayField = withStyles({
  root: {
    width: 100
  }
})(ArrayField)

export const StudentShow = props => (
  <Show aside={<Aside />} {...props}>
    <TabbedShowLayout>
      <Tab label='Cours'>
        <FullArrayField source='enrolled_courses' label=''>
          <Datagrid
            expand={
              <FullArrayField source='timetable'>
                <Datagrid>
                  <ReferenceField reference='teachers' source='teacher_id' label='Enseignant'>
                    <TextField source='first_name' />
                  </ReferenceField>
                  <DateField showTime={true} source='start' label='Début' />
                  <DateField showTime={true} source='end' label='Fin' />
                </Datagrid>
              </FullArrayField>
            }
          >
            <ReferenceField reference='courses' source='course_id' label='Code'>
              <TextField source='code' />
            </ReferenceField>

            <TextField source='course_name' label='Nom' />
          </Datagrid>
        </FullArrayField>
      </Tab>
      <Tab label='Emploi du temps'>
        <Timetable />
      </Tab>
    </TabbedShowLayout>
  </Show>
)

export default StudentList
