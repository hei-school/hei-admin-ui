import {
  heiDoc1,
  heiDocsMocks,
  newDoc,
  newWorkerDoc,
  workDoc1,
  workDocsMocks,
} from "../fixtures/api_mocks/docs-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Manager.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", `/students?*`, studentsMock);
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/work_files?*`,
      workDocsMocks
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/work_files/${workDoc1.id}`,
      workDoc1
    );
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/work_files/raw?filename=new_document&work_study_status=WORKING*`,
      newWorkerDoc
    );

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-last_name").type(student1Mock.last_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.last_name).click();
    cy.getByTestid("docs-button").click();
  });

  it("can detail and download a student worker doc", () => {
    cy.get(
      '[href="#/students/student1_id/docs/students/WORK_DOCUMENT"]'
    ).click();

    cy.contains("Afficher").click();

    cy.contains("Document : " + workDoc1.name);

    cy.getByTestid("download-link").and("have.attr", "href");
  });
});

describe("Manager.Hei.Docs", () => {
  beforeEach(() => {
    cy.intercept("GET", "/school/files?*", heiDocsMocks);
    cy.intercept("GET", `/school/files/${heiDoc1.id}`, heiDoc1);
    cy.intercept(
      "POST",
      `/school/files/raw?file_type=DOCUMENT&filename=${newDoc.name}`,
      newDoc
    );

    cy.login({role: "MANAGER"});

    cy.get('[data-testid="docs"]').click();
    cy.getByTestid("hei-docs").click();
  });

  it("can detail and download a hei doc", () => {
    cy.contains("Afficher", {timeout: 10000}).click();
    cy.contains("Document : " + heiDoc1.name);
    cy.getByTestid("download-link").and("have.attr", "href");
  });
});

describe("Student Ceritificate", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/scholarship_certificate/raw`,
      {fixture: "/students/certificate.pdf"}
    ).as("downloadCertificate");
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
      {fixture: "/students/certificate.pdf"}
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
