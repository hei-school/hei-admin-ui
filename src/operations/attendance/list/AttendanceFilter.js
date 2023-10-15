import { DateTimeInput } from 'react-admin';

export const attendanceFilters = [
  <DateTimeInput variant='outlined' source='from' label='Après' />,
  <DateTimeInput variant='outlined' source='to' label='Avant' />,
]
