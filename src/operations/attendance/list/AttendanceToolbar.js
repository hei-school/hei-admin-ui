import { HaToolbar, LiveFilter, FilterForm, SelectFilter, DateTimeFilter, AutocompleteFilter } from '../../../ui/haToolbar'
import { teachingApi, usersApi } from '../../../providers/api'
import { AttendanceStatus } from '../../../gen/haClient'

function AttendanceAddFilter() {
  return (
    <FilterForm>
      <SelectFilter
        label='Status'
        fetcher={[
          { label: 'Present', value: AttendanceStatus.Present },
          { label: 'En Retard', value: AttendanceStatus.Late },
          { label: 'Absent', value: AttendanceStatus.Missing }
        ]}
        source='attendance_statuses'
        valueKey='value'
        labelKey='label'
      />
      <AutocompleteFilter
        fetcher={courseCode => teachingApi().getCourses(courseCode, undefined, undefined, undefined, undefined, undefined, undefined, 1, 5)}
        label='Cours'
        labelKey='code'
        labelKeyOnNull='name'
        valueKey='id'
        source='courses_ids'
      />
      <AutocompleteFilter
        fetcher={first_name => usersApi().getTeachers(1, 5, undefined, first_name)}
        label='Enseignants'
        labelKey='first_name'
        labelKeyOnNull='last_name'
        valueKey='id'
        source='teachers_ids'
      />
      <DateTimeFilter source='from' label='Après' />
      <DateTimeFilter source='to' label='Avant' />
    </FilterForm>
  )
}

export function AttendanceTooblar() {
  return <HaToolbar leftAction={<LiveFilter source='student_key_word' label='Filtre par étudiant' />} rightAction={<AttendanceAddFilter />} />
}
