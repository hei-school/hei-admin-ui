import {statsMocks} from "../fixtures/api_mocks/letters-mocks";
import {
  createdStudents,
  liteCreatedStudents,
  student1Mock,
  studentsMock,
} from "../fixtures/api_mocks/students-mocks";
import {importFile} from "./utils";

const _path = "cypress/fixtures/students_import";

describe("Manager create multiple students", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&last_name=${student1Mock.last_name}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept("GET", `letters/stats`, statsMocks).as("getStats");

    cy.wait("@getWhoami", {timeout: 10000});
    cy.getByTestid("students-menu").click();
    cy.get('[href="#/students"]').click();
  });

  it("cannot create students if the file is empty", () => {
    importFile(
      "0_student_template.xlsx",
      "Il n'y a pas d'élément à insérer",
      _path
    );
  });

  it.skip("cannot create students if there is too much students to create", () => {
    importFile(
      "13_template.xlsx",
      "Vous ne pouvez importer que 20 éléments à la fois.",
      _path
    );
  });

  it("cannot create students if the headers are not corrects", () => {
    importFile(
      "wrong_heads_students_template.xlsx",
      "Veuillez re-vérifier les en-têtes de votre fichier",
      _path
    );
  });

  it.skip("can create multiple students with the correct file", () => {
    cy.intercept("PUT", "/students?due_datetime=2024-10-26T21%3A00%3A00.000Z", [
      createdStudents,
    ]).as("createStudents");
    importFile(
      "correct_students_template.xlsx",
      "Importation effectuée avec succès",
      _path
    );
  });

  it.skip("can create multiple students with the correct file and minimum infos", () => {
    cy.intercept("PUT", "/students?due_datetime=2024-10-26T21%3A00%3A00.000Z", [
      liteCreatedStudents,
    ]).as("createStudents");
    importFile(
      "lite_correct_students_template.xlsx",
      "Importation effectuée avec succès",
      _path
    );
  });

  it("notifies if the multiple students creation failed", () => {
    cy.intercept("PUT", "/students", {
      statusCode: 500,
      body: {
        message: "error",
      },
    }).as("createStudent");
    importFile(
      "correct_students_template.xlsx",
      "L'importation n'a pas pu être effectuée",
      _path
    );
  });
});
