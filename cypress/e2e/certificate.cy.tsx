import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";
const MESSAGE_ERROR = "Échec de téléchargement. Veuillez réessayer";

describe("Student Ceritificate", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      {fixture: "/students/certificate.pdf"}
    ).as("downloadCertificate");
  });

  it("Should notify error if blob.byteLength is < 0", () => {
    cy.mockLogin({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      new Blob()
    ).as("downloadCertificate");

    cy.getByTestid("download-button").click();
    cy.wait("@downloadCertificate");

    cy.contains(MESSAGE_ERROR);
    cy.getByTestid("file-link").should("not.have.attr", "href");
  });

  it("student can get his certificate", () => {
    cy.mockLogin({role: "STUDENT"});

    cy.getByTestid("download-button").click();
    cy.wait("@downloadCertificate");

    cy.getByTestid("file-link").and("have.attr", "href").and("include", "blob");
  });

  it("manager can get student's certificate", () => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudents2"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10?first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getFilteredStudent");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      {fixture: "/students/certificate.pdf"}
    ).as("downloadCertificate");

    cy.getByTestid("students-menu").click();
    cy.get('[href="/students"]').click();
    cy.wait("@getStudents");

    cy.getByTestid("main-search-filter").type(student1Mock.first_name);
    cy.wait("@getFilteredStudent");

    cy.contains(student1Mock.first_name).click();
    cy.wait("@getStudent1");

    cy.getByTestid("docs-button").click();
    cy.getByTestid("download-button").click();

    cy.wait("@downloadCertificate");

    cy.getByTestid("file-link").and("have.attr", "href").and("include", "blob");
  });
});
