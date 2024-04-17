import {student1Mock, studentsMock} from "../fixtures/students-mocks";
const MESSAGE_ERROR = "Échec de téléchargement. Veuillez réessayer";

// TODO: maybe should use something like the following function for all tests
describe("Student Ceritificate", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      {fixture: "/files/student_certificate.pdf"}
    ).as("downloadCertificate");
  });

  it("Should notify error if blob.byteLength is < 0", () => {
    cy.login({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      new Blob()
    ).as("downloadCertificate");

    cy.getByTestid("get-certificate-btn").click();
    cy.wait("@downloadCertificate");

    cy.contains(MESSAGE_ERROR);
    cy.getByTestid("certificate-link").should("not.have.attr", "href");
  });

  it("student can get his certificate", () => {
    cy.login({role: "STUDENT"});

    cy.getByTestid("get-certificate-btn").click();
    cy.wait("@downloadCertificate");

    cy.getByTestid("certificate-link")
      .and("have.attr", "href")
      .and("include", "blob");
  });

  it("manager can get student's certificate", () => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
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
      {fixture: "files/student_certificate.pdf"}
    ).as("downloadCertificate");

    cy.getByTestid("students-menu").click();
    cy.get('[href="#/students"]').click();
    cy.wait("@getStudents");

    cy.getByTestid("main-search-filter").type(student1Mock.first_name);
    cy.wait("@getFilteredStudent");

    cy.contains(student1Mock.first_name).click();
    cy.wait("@getStudent1");

    cy.getByTestid("docs-button").click();
    cy.getByTestid("get-certificat").click();

    cy.wait("@downloadCertificate");

    cy.getByTestid("certificate-link")
      .and("have.attr", "href")
      .and("include", "blob");
  });
});
