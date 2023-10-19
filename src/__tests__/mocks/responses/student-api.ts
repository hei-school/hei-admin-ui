import { Student, EnableStatus, StudentSexEnum, Whoami, WhoamiRoleEnum, User, UserSexEnum } from 'src/gen/haClient'

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
  student1Mock,
  {
    id: 'student2_id',
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
    id: 'student3_id',
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
    id: 'student4_id',
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
    id: 'student5_id',
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
    id: 'student6_id',
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
    id: 'student7_id',
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
    id: 'student8_id',
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
    id: 'student9_id',
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
    id: 'student10_id',
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

export const whoamiStudentMock: Whoami = { id: student1Mock.id, role: WhoamiRoleEnum.Student, bearer: 'bearer mock' }

export const createStudent: User = {
  ref: 'STD000001',
  first_name: 'string',
  last_name: 'string',
  sex: UserSexEnum.F,
  birth_date: '2023-02-17',
  address: 'Rue Dr Raseta Andraharo ,Ambanja,Madagascar',
  phone: '+261 234 1779',
  email: 'test+create+student@hei.school',
  entrance_datetime: '2023-02-17',
  status: EnableStatus.Enabled
}
export const liteCreatedStudent: User = {
  ref: 'STD000001',
  first_name: 'string',
  last_name: 'string',
  email: 'test+create+student@hei.school',
  entrance_datetime: '2023-02-17',
  status: EnableStatus.Enabled
}

export const createdStudents: User[] = [
  {
    id: 'id1',
    ref: 'STD000001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'userSTD000001@hei.school',
    sex: 'M',
    birth_date: '02-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'id2',
    ref: 'STD000002',
    first_name: 'Patrick',
    last_name: 'Smith',
    email: 'userSTD000002@hei.school',
    sex: 'F',
    birth_date: '03-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'id3',
    ref: 'STD000003',
    first_name: 'Jeanne',
    last_name: 'Smith',
    email: 'userSTD000003@hei.school',
    sex: 'M',
    birth_date: '04-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'id4',
    ref: 'STD000004',
    first_name: 'Jean',
    last_name: 'Smith',
    email: 'userSTD000004@hei.school',
    sex: 'F',
    birth_date: '05-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'id5',
    ref: 'STD000005',
    first_name: 'Pierre',
    last_name: 'Smith',
    email: 'userSTD000005@hei.school',
    sex: 'M',
    birth_date: '06-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'id6',
    ref: 'STD000006',
    first_name: 'Hélène',
    last_name: 'Smith',
    email: 'userSTD000006@hei.school',
    sex: 'F',
    birth_date: '07-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'id7',
    ref: 'STD000007',
    first_name: 'Patrice',
    last_name: 'Smith',
    email: 'userSTD000007@hei.school',
    sex: 'M',
    birth_date: '08-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  }
]
export const liteCreatedStudents: User[] = [
  {
    id: 'id1',
    ref: 'STD000001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'userSTD000001@hei.school',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  },
  {
    id: 'id2',
    ref: 'STD000002',
    first_name: 'Patrick',
    last_name: 'Smith',
    email: 'userSTD000002@hei.school',
    entrance_datetime: '2023-03-03T00:00:00.000Z',
    status: EnableStatus.Enabled
  }
]
