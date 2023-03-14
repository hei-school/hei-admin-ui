import { Student, EnableStatus, StudentSexEnum, Whoami, WhoamiRoleEnum, User, UserSexEnum } from 'src/gen/haClient'

export const studentNameToBeCheckedMock: string = 'jonatana'

export const student1Mock: Student = {
    id: 'student1_id',
    ref: 'STD21001',
    first_name: 'Ryan',
    last_name: 'Andria',
    sex: StudentSexEnum.M,
    birth_date: '2000-01-01',
    address: 'Adr 1',
    phone: '0322411123',
    email: 'test+ryan@hei.school',
    entrance_datetime: '2021-11-08T08:25:24Z',
    status: EnableStatus.Enabled
}
export const student1MockWithLocation: Student = {
  id: 'student1_id',
  ref: 'STD21001',
  first_name: 'Ryan',
  last_name: 'Andria',
  sex: StudentSexEnum.M,
  birth_date: '2000-01-01',
  address: 'Adr 1',
  location: {
    id: "string",
    longitude: 41.40338,
    latitude: 2.17403
  },
  phone: '0322411123',
  email: 'test+ryan@hei.school',
  entrance_datetime: '2021-11-08T08:25:24Z',
  status: EnableStatus.Enabled
}


export const whoamiStudentMock: Whoami = { id: student1Mock.id, role: WhoamiRoleEnum.Student, bearer: 'bearer mock' }

