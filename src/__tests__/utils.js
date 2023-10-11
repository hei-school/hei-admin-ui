import { createStudent, teachersMock } from './mocks/responses'
import { TurnsStringIntoDate } from '../operations/utils'

export const StudentRequestBodyVerification = (RequestBody, can_create_fees) => {
  let createStudentWithoutFeesBodyMock = { ...createStudent }
  createStudentWithoutFeesBodyMock.can_create_fees = can_create_fees
  createStudentWithoutFeesBodyMock.entrance_datetime = TurnsStringIntoDate(createStudent.entrance_datetime)
  expect(RequestBody[0]).to.deep.equal(createStudentWithoutFeesBodyMock)
  expect(RequestBody.length).to.equal(1)
}
export const updatedInfo = {
  ...teachersMock[0],
  last_name: 'new'
}
