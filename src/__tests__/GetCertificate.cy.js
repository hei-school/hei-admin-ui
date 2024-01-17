import {mount, unmount} from "@cypress/react";
import App from "../App";
import {manager1, student1} from "./credentials";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import {
  student1Mock,
  whoamiStudentMock,
  manager2,
  whoamiManagerMock,
  studentsMock,
} from "./mocks/responses";

const MESSAGE_ERROR = "Échec de téléchargement. Veuillez réessayer";

// TODO: maybe should use something like the following function for all tests
function login(credential, whoAmiMock) {
  cy.intercept("GET", `/whoami`, whoAmiMock).as("getWhoami");
  cy.get("#username").type(credential.username);
  cy.get("#password").type(credential.password);
  cy.get("button").contains("Connexion").click();
  cy.wait("@getWhoami");
}

describe(specTitle("Student Ceritificate"), () => {
  beforeEach(() => {
    mount(<App />);

    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      {fixture: "students/certificate.pdf"}
    ).as("downloadCertificate");
  });

  it("Should notify error if blob.byteLength is < 0", () => {
    login(student1, whoamiStudentMock);
    cy.get("body").click();
    cy.wait("@getStudent1");

    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      new Blob()
    ).as("downloadCertificate");

    cy.get('[data-testid="get-certificate-btn"]').click();
    cy.wait("@downloadCertificate");

    cy.contains(MESSAGE_ERROR);
    cy.get('[data-testid="certificate-link"]').should("not.have.attr", "href");
  });

  it("student can get his certificate", () => {
    login(student1, whoamiStudentMock);
    cy.get("body").click();
    cy.wait("@getStudent1");

    cy.get('[data-testid="get-certificate-btn"]').click();
    cy.wait("@downloadCertificate");

    cy.get('[data-testid="certificate-link"]')
      .should("not.be.visible")
      .and("have.attr", "href")
      .and("include", "blob");
  });

  it("manager can student's certificate", () => {
    login(manager1, whoamiManagerMock);

    cy.intercept("GET", `/managers/${manager2.id}`, manager2).as("getManager2");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10?first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getFilteredStudent");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      {fixture: "students/certificate.pdf"}
    ).as("downloadCertificate");

    cy.wait("@getManager2");

    cy.get('[data-testid="students-menu"]').click();
    cy.get('[href="#/students"]').click();
    cy.wait("@getStudents");

    cy.get('[data-testid="main-search-filter"]').type(student1Mock.first_name);
    cy.wait("@getFilteredStudent");

    cy.contains(student1Mock.first_name).click();
    cy.wait("@getStudent1");
    cy.get('[data-testid="get-certificate-btn"]').click();
    cy.wait("@downloadCertificate");

    cy.get('[data-testid="certificate-link"]')
      .should("not.be.visible")
      .and("have.attr", "href")
      .and("include", "blob");
  });

  afterEach(() => {
    unmount();
  });
});
