import React from 'react'
import { AssignmentTurnedIn } from '@mui/icons-material';
import { FilterList, FilterLiveSearch, SavedQueriesList } from 'react-admin'
import { AttendanceStatus } from '../../../gen/haClient';
import { Card,CardContent } from '@mui/material'
import FilterListItem from './FilterListItem';

function AttendanceAside() {
  return (
    <Card sx={{ order: -1, mr: 2, mt: 8}}>
      <CardContent>
        <FilterLiveSearch label='Rechercher par étudiant' variant='outlined' source='student_key_word'/>
        <SavedQueriesList />
        <FilterList label='Status' icon={<AssignmentTurnedIn />}>
          <FilterListItem type='attendance_statuses' label='Présent' value={AttendanceStatus.Present} />
          <FilterListItem type='attendance_statuses' label='En retard' value={ AttendanceStatus.Late } />
          <FilterListItem type='attendance_statuses' label='Absent' value={AttendanceStatus.Missing} />
        </FilterList>
      </CardContent>
    </Card>
  );
}

export default AttendanceAside
