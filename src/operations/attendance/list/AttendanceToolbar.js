import { HaToolbar, LiveFilter, AddFilter, SelectFilter, DateTimeFilter } from "../../utils";
import { teachingApi, usersApi } from '../../../providers/api'
import { AttendanceStatus } from "../../../gen/haClient";

function AttendanceRightAction(){
  return(
    <AddFilter>
      <SelectFilter 
        label='Status'
        fetcher={[
          {label: 'Present', value: AttendanceStatus.Present},
          {label: 'En Retard', value: AttendanceStatus.Late},
          {label: 'Absent', value: AttendanceStatus.Missing}
        ]}
        source='attendance_statuses'
        valueKey='value'
        labelKey='label'
      />
      <SelectFilter 
        label='Cours'
        fetcher={teachingApi().getCourses()}
        source='courses_ids'
        valueKey='id'
        labelKey='code'
      />
      <SelectFilter 
        label='Enseignants'
        fetcher={usersApi().getTeachers()}
        source='teachers_ids'
        valueKey='id'
        labelKey='first_name'
      />
      <DateTimeFilter source='from' label='Avant'/>
      <DateTimeFilter source='to' label='Après'/>
    </AddFilter>
  ) 
}

export function AttendanceTooblar(){
  return <HaToolbar
    leftAction={
      <LiveFilter source='student_key_word' placeholder='Étudiant' />
    }
    rightAction={
      <AttendanceRightAction />
    }
  />
}
