import {manager1Mock} from "../fixtures/api_mocks/managers-mocks";
import {
  createStudent,
  student1Mock,
  studentsMock,
} from "../fixtures/api_mocks/students-mocks";
import {
  teacher1Mock,
  teacherNameToBeCheckedMock,
  teachersMock,
} from "../fixtures/api_mocks/teachers-mocks";

const newLastname = "Aina herilala";
let createdStudent = {
  ...createStudent,
};
createdStudent.id = "ajbfq-fqdfjdh-2jkg3j";
let updatedStudent = {
  ...student1Mock,
};
updatedStudent.first_name = newLastname;

describe("Manager", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students?page=*&page_size=*`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept(
      "GET",
      `/students?page=*&page_size=*&ref=${student1Mock.ref}`,
      [student1Mock]
    ).as("getStudentsByRef");
    cy.intercept("GET", `/teachers?page=*&page_size=*`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept(
      "GET",
      `/teachers?page=*&page_size=*&first_name=${teacherNameToBeCheckedMock}`,
      [teacher1Mock]
    ).as("getTeacherByName");
    cy.intercept("GET", `/students/import/template`, {
      url: `https://preprod-storage-bucket-haapi-bucket-w0nawdbjed2n.s3.eu-west-3.amazonaws.com/STUDENT_IMPORT_TEMPLATE/etudiants.xlsx?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMyJGMEQCIBctDzyGcLt%2BwLSh%2FR9pNASc3YZWtqQZnbFjZaLTEOQBAiAaMJnbL5rOdMihzM28Mok35%2BUkJPOMvmwxwk90GWpoyyrCAwiv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE5NDcyMjQyNzIxMyIMqInc8VuuBsFRvpcfKpYDk%2F4QJNq50HqD7%2FeJzqwzxGuHSNnAP%2B0%2FViojHTet9BAJAkZNFhV5nmL7uof7cWygLBkYWdIbVyvOK5EGu4L4WtzMZ0LZ5zVpKrrdt2wyaZWHattJ0RIxCow5n6cOb47uXA8pye%2BGp1Qf%2BMojJ6H%2FL1D1mMg5scLyniE3NZeXkvVW4tigIjAizyESDsdGcEiZ3%2FzM5CC73wSJKEt6TithtGgd1QZkV2ZuJ%2ByhRNw8uYJ%2FO%2FwWte01M8jNE5sby3dANc1BCFhCz8fDQpEBtNt8n9d1CpdgZ2l5Wejl%2FsyHpLd0%2FHR0FQo4W%2FRWNSINVoj%2BsQPsgicgSEkAR3k%2F5qMfBxGSPIePr2wWRJ75GfgaB5r10fw5pGTCAqrQKPV680vT%2B7acoyClp6rBiTjG%2B%2FgbmZtYWcTt4YwTFfL3hC8VrOTO%2BjRKtamFjnUTgGUzrZxEjGL6UKp64PwMjunP5GpRxWqsJJlWix%2BJlSrN0wLLyY6SSP3LaoRo3dOrNj3YPcH1cmUlWrc40dmvOmicAkd5gGVHVPntvjCayuzIBjqfAbjIjLFVYU811yH8admF4p5O2PGtzPdEFVNWO%2BiA515g5PueQ3ikiC5W9GAXAricRqenb%2FkQlqYGDCcj%2FYXL94OciRcOSUuCL6xojAwihEV3ubGDM9iZ20iETA5dxDxGaOo0%2B6p9QcK7xP8PWKFabxxEFHj148YrzMz1Gy4RsJBGVHWJfdQLoSJqtAPOusrXST3dcPGO%2Bgabx9DQJC7xqg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251117T133814Z&X-Amz-SignedHeaders=host&X-Amz-Credential=ASIAS2VS4OFGVV2TSOE2%2F20251117%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Expires=300&X-Amz-Signature=724b6af6c3c057b3dcb86dfc94f862db080447144fab3b2fbff6482cac3bafcd`,
    }).as("getStudentImportTemplate");
  });

  it("lands on profile page if succeeds", () => {
    cy.get("#main-content")
      .should("contain", manager1Mock.ref)
      .and("contain", manager1Mock.last_name)
      .and("contain", manager1Mock.address)
      .and("contain", manager1Mock.email)
      .and("contain", manager1Mock.phone);
  });

  it("can list and filter students", () => {
    cy.contains("Enseignants");
    cy.contains("Étudiants");

    cy.getByTestid("students-menu").click(); // Étudiants category
    cy.get('[href="/students"]').click();
    cy.contains("Page: 1");
    cy.contains(`Taille: ${studentsMock.length}`);
    cy.get('td input[type="checkbox"]').should("not.exist");

    cy.get("#next-button").click();
    cy.contains("Page: 2");

    cy.getByTestid("main-search-filter").type(student1Mock.ref);
    cy.wait("@getStudentsByRef");
    cy.get("#main-content table").contains(student1Mock.first_name);
    cy.contains("Page: 1");
  });

  it("can list and filter teachers", () => {
    cy.get('[href="/teachers"]').click();
    cy.contains("Page: 1");
    cy.contains(`Taille: ${studentsMock.length}`);
    cy.get('td input[type="checkbox"]').should("not.exist");

    cy.get("#next-button").click();
    cy.contains("Page: 2");

    cy.getByTestid("main-search-filter").type(teacherNameToBeCheckedMock);
    cy.wait("@getTeacherByName");
    cy.get("#main-content table").contains(teacherNameToBeCheckedMock);
    cy.contains("Page: 1");
  });

  it("can download template of onboarding", () => {
    cy.contains("Étudiants");
    cy.getByTestid("students-menu").click();
    cy.get('[href="/students"]').click();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("download-template-button").click();
    cy.wait("@getStudentImportTemplate")
      .its("response.statusCode")
      .should("eq", 200);
  });
});
