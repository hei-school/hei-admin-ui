import { EnableStatus, StudentSexEnum } from '../../../gen/haClient'
import { student1Mock, studentNameToBeCheckedMock, studentsMock } from './student-api'

export const groups = [
  {
    id: 'group1_id',
    name: 'The group number one',
    ref: 'G1',
    creation_datetime: '2023-10-26T11:31:19.312Z'
  },
  {
    id: 'group2_id',
    name: 'The group number two',
    ref: 'G2',
    creation_datetime: '2023-10-26T11:31:19.312Z'
  }
]
export const group1 = groups[0]

export const newGroup1 = {
  id: 'group1_id',
  name: 'The group number one',
  ref: 'G1',
  creation_datetime: '2023-10-26T11:31:19.312Z',
  students: ['student2_id', 'student3_id']
}

export const group1Students = [studentsMock[1], studentsMock[2]]

export const editedGroup = {
  id: 'group1_id',
  name: 'The edited group',
  ref: 'G1 bis',
  creation_datetime: '2023-10-26T11:31:19.312Z'
}
export const student1 = studentsMock[4]
