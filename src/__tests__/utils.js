import { createStudent, teachersMock } from "./mocks/responses";
import { turnStringIntoDate } from "../operations/utils";

export const studentRequestBodyVerification = (
  requestBody,
  createStudentNoFees
) => {
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

export const testFeesWithTemplate = (feesToCreate, template)=>{
  const currentDateString = new Date().toDateString();
  expect(feesToCreate.total_amount).to.equal(template.amount);
  expect(feesToCreate.type).to.equal(template.type);
  expect(new Date(feesToCreate.creation_datetime).toDateString()).to.equal(currentDateString);
}
