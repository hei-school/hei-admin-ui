import { EnableStatus, Whoami, WhoamiRoleEnum, Teacher, Sex, User } from '@haapi/typescript-client'

export const teacherNameToBeCheckedMock: string = 'Toky'

export const teacher1Mock: Teacher = {
  id: 'teacher1_id',
  ref: 'TCR21001',
  first_name: teacherNameToBeCheckedMock,
  last_name: 'Teacher',
  sex: Sex.F,
  birth_date: '1990-01-01',
  address: 'Adr 3',
  phone: '0322411125',
  email: 'test+teacher1@hei.school',
  entrance_datetime: new Date('2021-10-08T08:27:24Z'),
  status: EnableStatus.ENABLED
}

export const whoamiTeacherMock: Whoami = { id: 'teacher1_id', role: WhoamiRoleEnum.TEACHER, bearer: 'bearer mock' }

export const teachersMock: Teacher[] = [
  teacher1Mock,
  {
    id: 'teacher2_id',
    ref: 'TCR0002',
    first_name: 'Mayah',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '2023-01-18',
    address: 'LOT 215641',
    phone: '+261335682546',
    email: 'test+fortest5341313@hei.school',
    entrance_datetime: new Date('2023-01-17'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher3_id',
    ref: 'TCR0003',
    first_name: 'Rayan',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '1990-01-01',
    address: 'Adr 3',
    phone: '0322411125',
    email: 'test+teacher1@hei.school',
    entrance_datetime: new Date('2021-10-08'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher4_id',
    ref: 'TCR0004',
    first_name: 'Toky',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '1990-01-02',
    address: 'Adr 4',
    phone: '0322411126',
    email: 'test+teacher2@hei.school',
    entrance_datetime: new Date('2021-10-09'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher5_id',
    ref: 'TCR0005',
    first_name: 'Lou',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '1990-01-02',
    address: 'Adr 4',
    phone: '0322411126',
    email: 'test+teacher3@hei.school',
    entrance_datetime: new Date('2021-10-09'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher6_id',
    ref: 'TCR0006',
    first_name: 'Hary',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '2004-06-08',
    address: 'Antanimena ',
    phone: '+261 39 34 323 30',
    email: 'hei.mayah.3@gmail.com',
    entrance_datetime: new Date('2021-01-13'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher7_id',
    ref: 'TCR0007',
    first_name: 'Sandrine',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '1991-01-18',
    address: 'LOT A58 Itosy',
    phone: '+261339536218',
    email: 'Sandrine@hei.school',
    entrance_datetime: new Date('2023-01-17'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher8_id',
    ref: 'TCR0008',
    first_name: 'Herilala',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '1990-01-01',
    address: 'Adr 8',
    phone: '0331413432',
    email: 'herilala@hei.school',
    entrance_datetime: new Date('2021-10-08'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher9_id',
    ref: 'TCR0009',
    first_name: 'Mandrasy',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '1990-01-02',
    address: 'Adr 9',
    phone: '0322865596',
    email: 'Mandresy@hei.school',
    entrance_datetime: new Date('2021-10-09'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'teacher10_id',
    ref: 'TCR00010',
    first_name: 'Ny Hasina',
    last_name: 'Teacher',
    sex: Sex.F,
    birth_date: '1990-01-02',
    address: 'Adr 4',
    phone: '0322411126',
    email: 'test+teacher3@hei.school',
    entrance_datetime: new Date('2021-10-09'),
    status: EnableStatus.ENABLED
  }
]

export const createdTeachers: User[] = [
  {
    id: 'id1',
    ref: 'TCR000001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'userTCR000001@hei.school',
    sex: Sex.F,
    birth_date: '02-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'id2',
    ref: 'TCR000002',
    first_name: 'Patrick',
    last_name: 'Smith',
    email: 'userTCR000002@hei.school',
    sex: Sex.F,
    birth_date: '03-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'id3',
    ref: 'TCR000003',
    first_name: 'Jeanne',
    last_name: 'Smith',
    email: 'userTCR000003@hei.school',
    sex: Sex.F,
    birth_date: '04-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'id4',
    ref: 'TCR000004',
    first_name: 'Jean',
    last_name: 'Smith',
    email: 'userTCR000004@hei.school',
    sex: Sex.F,
    birth_date: '05-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'id5',
    ref: 'TCR000005',
    first_name: 'Pierre',
    last_name: 'Smith',
    email: 'userTCR000005@hei.school',
    sex: Sex.F,
    birth_date: '06-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'id6',
    ref: 'TCR000006',
    first_name: 'Hélène',
    last_name: 'Smith',
    email: 'userTCR000006@hei.school',
    sex: Sex.F,
    birth_date: '07-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'id7',
    ref: 'TCR000007',
    first_name: 'Patrice',
    last_name: 'Smith',
    email: 'userTCR000007@hei.school',
    sex: Sex.F,
    birth_date: '08-06-05',
    address: 'address',
    phone: '236542132',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  }
]
export const liteCreatedTeachers: User[] = [
  {
    id: 'id1',
    ref: 'TCR000001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'userTCR000001@hei.school',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  },
  {
    id: 'id2',
    ref: 'TCR000002',
    first_name: 'Patrick',
    last_name: 'Smith',
    email: 'userTCR000002@hei.school',
    entrance_datetime: new Date('2022-02-28'),
    status: EnableStatus.ENABLED
  }
]
