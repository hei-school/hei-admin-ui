import { Student, EnableStatus, StudentSexEnum, Whoami, WhoamiRoleEnum } from 'src/gen/haClient'

export const studentNameToBeCheckedMock: string = 'herilala'

export const student1Mock: Student = {
  id: 'student1_id',
  ref: 'STD21111',
  first_name: studentNameToBeCheckedMock,
  last_name: 'Rafanomezantsoa',
  sex: StudentSexEnum.M,
  birth_date: '2000-01-01',
  address: 'Adr 1',
  phone: '0322411123',
  email: 'test+ryan@hei.school',
  entrance_datetime: '2021-11-08T08:25:24Z',
  status: EnableStatus.Enabled
}

export const studentsMock: Student[] = [
  {
    id: 'e29c3c53-50e4-4830-bc2d-0031c03f889d',
    ref: 'SRD21054313',
    first_name: 'Firstname',
    last_name: 'LastName',
    sex: StudentSexEnum.F,
    birth_date: '2023-01-11',
    address: 'LOT 351f24',
    phone: '+261335268125',
    email: 'test+student534@gmail.com',
    entrance_datetime: '2023-01-25T21:00:00Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'fd2303d5-b116-461d-83c6-f2a09baebb47',
    ref: 'STD00025',
    first_name: 'Twenty',
    last_name: 'Student',
    sex: StudentSexEnum.M,
    birth_date: '2000-12-27',
    address: 'lot 1245',
    phone: '+2613356894256',
    email: 'test+twentyFive@hei.school',
    entrance_datetime: '2023-01-19T12:00:00Z',
    status: EnableStatus.Enabled
  },
  {
    id: '162da931-02be-4550-823e-226a44b7a6ce',
    ref: 'STD123365',
    first_name: 'John',
    last_name: 'Johnny',
    sex: StudentSexEnum.M,
    birth_date: '1992-02-12',
    address: 'lot',
    phone: '0335689752',
    email: 'mayahnyando@gmail.com',
    entrance_datetime: '2021-05-12T09:50:00Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'fc68d13f-4a16-4f54-82bc-a92f6e52e66f',
    ref: 'STD 20002',
    first_name: 'Old',
    last_name: 'Student',
    sex: StudentSexEnum.M,
    birth_date: '2005-02-02',
    address: 'lot 12345',
    phone: '+261 33 26 523 56 ',
    email: 'test+student45132165@hei.school',
    entrance_datetime: '2022-01-20T07:00:00Z',
    status: EnableStatus.Enabled
  },
  {
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
  },
  {
    id: 'student2_id',
    ref: 'STD21002',
    first_name: 'Two',
    last_name: 'Student',
    sex: StudentSexEnum.F,
    birth_date: '2000-01-02',
    address: 'Adr 2',
    phone: '0322411124',
    email: 'test+student2@hei.school',
    entrance_datetime: '2021-11-09T08:26:24Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'student3_id',
    ref: 'STD21003',
    first_name: 'quitzon',
    last_name: 'Student',
    sex: StudentSexEnum.F,
    birth_date: '2000-01-02',
    address: 'Adr 2',
    phone: '0322411124',
    email: 'test+student3@hei.school',
    entrance_datetime: '2021-11-09T08:26:24Z',
    status: EnableStatus.Enabled
  },
  {
    id: '3f2d8478-77b8-4626-8e5d-e1ab9b0567e2',
    ref: 'STD21004',
    first_name: 'Test',
    last_name: 'Three',
    sex: StudentSexEnum.F,
    birth_date: '2014-02-07',
    address: 'lot',
    phone: '+261 34 21 435 12',
    email: 'Test@hei.school',
    entrance_datetime: '2023-01-04T21:00:00Z',
    status: EnableStatus.Enabled
  },
  {
    id: '344d03d4-9bc1-44f1-bc45-e652f29f6323',
    ref: 'std2100552968687',
    first_name: 'Check if it really works',
    last_name: 'Student',
    sex: StudentSexEnum.M,
    birth_date: '2022-12-30',
    address: 'lot 5454f',
    phone: '+261335689741',
    email: 'test+studen354651@gmail.com',
    entrance_datetime: '2023-01-04T21:00:00Z',
    status: EnableStatus.Enabled
  },
  {
    id: '9a89de8f-8a4d-4d8b-8c79-1ee046d6297c',
    ref: 'STD2103265',
    first_name: 'For Test',
    last_name: 'For Test',
    sex: StudentSexEnum.M,
    birth_date: '2023-01-03',
    address: 'lot 541215246546',
    phone: '0325689456',
    email: 'test+student12665673@hei.school',
    entrance_datetime: '2022-12-31T21:00:00Z',
    status: EnableStatus.Enabled
  }
]

export const whoamiStudentMock: Whoami = { id: 'student1_id', role: WhoamiRoleEnum.Student, bearer: 'bearer mock' }
