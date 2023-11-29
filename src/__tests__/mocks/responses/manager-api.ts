import { EnableStatus, Whoami, WhoamiRoleEnum, Manager, ManagerSexEnum } from 'haapi-Ts-client'

export const managerNameToBeCheckedMock: string = 'Lou'

export const manager1Mock: Manager = {
  id: 'manager1_id',
  ref: 'MGR21001',
  first_name: managerNameToBeCheckedMock,
  last_name: 'Manager',
  sex: ManagerSexEnum.M,
  birth_date: '1890-01-01',
  address: 'A78 Ambohitrarahaba',
  phone: '0322411127',
  email: 'test+manager1@hei.school',
  entrance_datetime: new Date('2021-09-08T08:25:29Z'),
  status: EnableStatus.ENABLED
}

export const whoamiManagerMock: Whoami = { id: manager1Mock.id, role: WhoamiRoleEnum.MANAGER, bearer: 'token == null ? undefined : token' }
