import { EnableStatus, Manager, Sex, Whoami, WhoamiRoleEnum } from '@haapi/typescript-client'

export const manager1FirstName: string = 'Lou'

export const manager2: Manager = {
  id: 'manager1_id',
  ref: 'MGR21001',
  first_name: manager1FirstName,
  last_name: 'Manager',
  sex: Sex.M,
  birth_date: '1890-01-01',
  address: 'A78 Ambohitrarahaba',
  phone: '0322411127',
  email: 'test+manager1@hei.school',
  entrance_datetime: new Date('2021-09-08T08:25:29Z'),
  status: EnableStatus.ENABLED
}

export const editedManager2: Manager = {
  id: 'manager1_id',
  ref: 'MGR21001',
  first_name: manager1FirstName,
  last_name: 'Andria',
  sex: Sex.M,
  birth_date: '1995-01-01',
  address: 'A78 Ambohitrarahaba',
  phone: '0322411127',
  email: 'test+manager1@hei.school',
  entrance_datetime: new Date('2021-09-08T08:25:29Z'),
  status: EnableStatus.ENABLED
}
export const whoamiManagerMock: Whoami = { id: manager2.id, role: WhoamiRoleEnum.MANAGER, bearer: 'token == null ? undefined : token' }
