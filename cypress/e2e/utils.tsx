import {createStudent} from "../fixtures/api_mocks/students-mocks";
import {teachersMock} from "../fixtures/api_mocks/teachers-mocks";

// TODO: avoid type any
export const studentRequestBodyVerification = (
  requestBody: any,
  createStudentNoFees: any
) => {
  createStudentNoFees.entrance_datetime = new Date(
    createStudent.entrance_datetime!
  ).toISOString();
  expect(requestBody[0]).to.deep.equal(createStudentNoFees);
  expect(requestBody.length).to.equal(1);
};
export const updatedInfo = {
  ...teachersMock[0],
  last_name: "new",
};

export const importFile = (file: string, message: string, _path: string) => {
  const _mockFile = `${_path}/${file}`;

  cy.getByTestid("menu-list-action").click();
  cy.get("#import-button").click();
  cy.getByTestid("inputFile").selectFile(_mockFile, {force: true});
  cy.getByTestid("inputFile").selectFile(_mockFile, {force: true});

  cy.contains("Confirmer").click();
  cy.contains(message, {timeout: 7000});
};

export const assertFeeMatchesTemplate = (feeToCreate: any, template: any) => {
  const currentDateString = new Date().toDateString();
  expect(feeToCreate.total_amount).to.equal(template.amount);
  expect(feeToCreate.type).to.equal(template.type);
  expect(new Date(feeToCreate.creation_datetime).toDateString()).to.equal(
    currentDateString
  );
};

// Utils for writing a datetime in the input of React Admin
export const getDateTimeString = (date: Date) => {
  const DATE_TIME_LENGTH = 16; // ISO string length to include date and hour without seconds
  return date.toISOString().slice(0, DATE_TIME_LENGTH);
};
