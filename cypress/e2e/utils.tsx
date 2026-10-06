import {
  CreateFee,
  FeeTemplate,
  Student,
} from "@haapi-b0fc7615/typescript-client";
import {createStudent} from "../fixtures/api_mocks/students-mocks";
import {teachersMock} from "../fixtures/api_mocks/teachers-mocks";

type ExpectedStudentBody = Omit<Student, "entrance_datetime"> & {
  entrance_datetime?: Date | string;
};

// TODO: avoid type any
export const studentRequestBodyVerification = (
  requestBody: unknown[],
  createStudentNoFees: ExpectedStudentBody
) => {
  createStudentNoFees.entrance_datetime = new Date(
    createStudent.entrance_datetime!
  ).toISOString();
  expect(requestBody[0]).to.deep.equal(createStudentNoFees);
  expect(requestBody).to.have.lengthOf(1);
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
  cy.contains(message);
};

/** A fee read from a request body: its date may come serialized as a string. */
export type FeeRequestBody = Pick<CreateFee, "total_amount" | "type"> & {
  creation_datetime?: Date | string;
};

// a missing date never matches the current day, as new Date(undefined) did
const toDateString = (datetime?: Date | string) =>
  datetime === undefined ? undefined : new Date(datetime).toDateString();

export const assertFeeMatchesTemplate = (
  feeToCreate: FeeRequestBody,
  template: Pick<FeeTemplate, "amount" | "type">
) => {
  const currentDateString = new Date().toDateString();
  expect(feeToCreate.total_amount).to.equal(template.amount);
  expect(feeToCreate.type).to.equal(template.type);
  expect(toDateString(feeToCreate.creation_datetime)).to.equal(
    currentDateString
  );
};

export const heiAdmin = (tail: string) =>
  (
    Cypress.env("REACT_APP_API_URL") ||
    "https://tp039nqls3.execute-api.eu-west-3.amazonaws.com"
  ).concat(tail);

type Callable = (...args: never[]) => unknown;

/**
 * Narrows a value read from the application window (exposed for tests) to the
 * signature the test expects. Fails the test if the value is not a function.
 */
export const asWindowFunction = <F extends Callable>(value: unknown): F => {
  if (typeof value !== "function") {
    throw new TypeError("Expected a function exposed on window");
  }
  return value as F;
};
