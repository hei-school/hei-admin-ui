import { DateTimeInput } from 'react-admin';
import ListActions from './ListActions';

export const attendanceFilters = [
  <DateTimeInput source='from' label='Après' />,
  <DateTimeInput source='to' label='Avant' />,
  <ListActions />
]
