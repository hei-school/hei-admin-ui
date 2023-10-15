import React from 'react'
import { Datagrid, DateField, List, TextField } from 'react-admin';
import { PrevNextPagination, pageSize } from '../../utils';
import AttendanceAside from './AttendanceAside';
import { attendanceFilters } from './AttendanceFilter';
import ListActions from './ListActions';

export const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const AttendanceList = () => {
  return (
    <List
      title='Présences'
      hasCreate={false}
      actions={<ListActions />}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
      aside={<AttendanceAside />}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source='student.ref' label='Référence' />
        <DateField label='Heure' locales='fr-FR' source='created_at' options={dateOptions} />
        <TextField source='place' label='Lieu' />
        <TextField source='student.first_name' label='Prénom·s' />
      </Datagrid>
    </List>
  );
}

export default AttendanceList
