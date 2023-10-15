import { DateTimeInput } from 'react-admin';

export const attendanceFilters = [
  <DateTimeInput source='from' label='Après' />,
  <DateTimeInput source='to' label='Avant' />,
]
