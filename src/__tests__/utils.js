import { createStudent, teachersMock } from './mocks/responses'
import { TurnsStringIntoDate } from '../operations/utils'

export const studentRequestBodyVerification = (requestBody, canCreateFees, createStudentNoFees) => {
  createStudentNoFees.can_create_fees = canCreateFees
  createStudentNoFees.entrance_datetime = TurnsStringIntoDate(createStudent.entrance_datetime)
  expect(requestBody[0]).to.deep.equal(createStudentNoFees)
  expect(requestBody.length).to.equal(1)
}
export const updatedInfo = {
  ...teachersMock[0],
  last_name: 'new'
}
