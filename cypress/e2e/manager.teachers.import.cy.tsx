import {student1Mock} from "../fixtures/api_mocks/students-mocks";
import {
  createdTeachers,
  liteCreatedTeachers,
  teacherNameToBeCheckedMock,
  teachersMock,
} from "../fixtures/api_mocks/teachers-mocks";
import {importFile} from "./utils";
const _path = "cypress/fixtures/teachers_import";

describe("Manager create multiple teachers", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `*/teachers?page=1&page_size=10`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `*/teachers?page=2&page_size=10`, teachersMock).as(
      "getTeachersPage2"
    );
    cy.intercept("GET", `students/letters/stats`, {}).as("getStats");
    cy.intercept(
      "GET",
      `*/teachers?page=1&page_size=10&last_name=${teacherNameToBeCheckedMock}`,
      [student1Mock]
    ).as("getTeachersByName");

    cy.wait("@getWhoami", {timeout: 10000});
    cy.get('[href="#/teachers"]').click();
  });

  it("cannot create teachers if the file is empty", () => {
    importFile(
      "0_teacher_template.xlsx",
      "Il n'y a pas d'élément à insérer",
      _path
    );
  });

  it("cannot create teachers if there is too much teachers to create", () => {
    importFile(
      "too_much_teachers_template.xlsx",
      "Vous ne pouvez importer que 20 éléments à la fois.",
      _path
    );
  });

  it("cannot create teachers if the headers are not corrects", () => {
    importFile(
      "wrong_headers_teachers_template.xlsx",
      "Veuillez re-vérifier les en-têtes de votre fichier",
      _path
    );
  });

  it("can create multiple teachers with the correct file", () => {
    cy.intercept("PUT", "*/teachers", [createdTeachers]).as("createteachers");
    importFile(
      "correct_teachers_template.xlsx",
      "Importation effectuée avec succès",
      _path
    );
  });

  it("can create multiple teachers with the correct file and minimum infos", () => {
    cy.intercept("PUT", "*/teachers", [liteCreatedTeachers]).as(
      "createteachers"
    );
    importFile(
      "correct_minimal_teachers_template.xlsx",
      "Importation effectuée avec succès",
      _path
    );
  });

  it("notifies if the multiple teachers creation failed", () => {
    cy.intercept("PUT", "*/teachers", {
      statusCode: 500,
      body: {
        message: "error",
      },
    }).as("createTeacher");
    importFile(
      "correct_minimal_teachers_template.xlsx",
      "L'importation n'a pas pu être effectuée",
      _path
    );
  });
});
