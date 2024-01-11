import {mount, unmount} from "@cypress/react";
import App from "../App";
import {manager1} from "./credentials";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import {
  createdStudents,
  liteCreatedStudents,
  manager2,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  whoamiManagerMock,
} from "./mocks/responses";
import {importFile} from "./utils";
const _path = "cypress/fixtures/students_import";
describe(specTitle("Manager create multiple students"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();

    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.intercept("GET", `/managers/${manager2.id}`, (req) => {
      req.reply((res) => {
        res.setDelay(400);
        res.send(manager2);
      });
    }).as("getManager1");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    cy.wait("@getWhoami", {timeout: 10000});
    cy.get('[data-testid="students-menu"]').click();
    cy.get('[href="#/students"]').click();
  });

  it("cannot create students if the file is empty", () => {
    importFile(
      "0_student_template.xlsx",
      "Il n'y a pas d'élément à insérer",
      _path
    );
    unmount();
  });

  it("cannot create students if there is too much students to create", () => {
    importFile(
      "13_template.xlsx",
      "Vous ne pouvez importer que 10 éléments à la fois.",
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

  it("can create multiple students with the correct file", () => {
    cy.intercept("PUT", "/students", [createdStudents]).as("createStudents");
    importFile(
      "correct_students_template.xlsx",
      "Importation effectuée avec succès",
      _path
    );
  });

  it("can create multiple students with the correct file and minimum infos", () => {
    cy.intercept("PUT", "/students", [liteCreatedStudents]).as(
      "createStudents"
    );
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
  afterEach(() => {
    unmount();
  });
});
