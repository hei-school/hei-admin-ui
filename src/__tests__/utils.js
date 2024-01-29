import { createStudent, teachersMock } from "./mocks/responses";
import { turnStringIntoDate } from "../operations/utils";

export const studentRequestBodyVerification = (
  requestBody,
  canCreateFees,
  createStudentNoFees
) => {
  createStudentNoFees.can_create_fees = canCreateFees;
  createStudentNoFees.entrance_datetime = turnStringIntoDate(
    createStudent.entrance_datetime
  );
  expect(requestBody[0]).to.deep.equal(createStudentNoFees);
  expect(requestBody.length).to.equal(1);
};
export const updatedInfo = {
  ...teachersMock[0],
  last_name: "new",
};

export const importFile = (file, message, _path) => {
  const _mockFile = `${_path}/${file}`;

  cy.get('[data-testid="menu-list-action"]').click();
  cy.get("#import-button").click();
  cy.get("[data-testid='inputFile']").selectFile(_mockFile, { force: true });
  cy.get('[data-testid="inputFile"]').selectFile(_mockFile, { force: true });

  cy.contains("Confirmer").click();

  cy.contains(message);
};


export const getEndOfMonth = (year, month) => {
  const lastDayOfMonth = new Date(year, month + 1, 1);
  return lastDayOfMonth;
}

export const testDateWithoutTime = (givenIsoDate, expectedIsoDate) => {
  const givenDate = new Date(givenIsoDate);
  const expectedDate = new Date(expectedIsoDate);

  expect(givenDate.getFullYear()).to.equal(expectedDate.getFullYear());
  expect(givenDate.getMonth()).to.equal(expectedDate.getMonth());
  expect(givenDate.getDay()).to.equal(expectedDate.getDay());
}
