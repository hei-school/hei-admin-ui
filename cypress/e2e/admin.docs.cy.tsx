import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {newOtherrDoc, otherDocsMocks} from "../fixtures/api_mocks/docs-mocks";
import {teacher1Mock, teachersMock} from "../fixtures/api_mocks/teachers-mocks";

describe("Admin Teacher Doc", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
  });

  it("can create a teacher document", () => {
    cy.intercept("GET", `/teachers?page=1&page_size=10`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", "/teachers?page=2&page_size=10", teachersMock).as(
      "getTeachers2"
    );
    cy.intercept("GET", `/teachers/${teacher1Mock.id}`, teacher1Mock).as(
      "getTeachers1"
    );
    cy.intercept(
      "GET",
      /teachers\?page=1&page_size=10&(first_name|ref|last_name)=/,
      [teacher1Mock]
    ).as("getFilters");
    cy.intercept(
      "GET",
      /teachers\?page=2&page_size=10&(first_name|ref|last_name)=/,
      [teacher1Mock]
    ).as("getFilters2");
    cy.intercept(
      "GET",
      `/users/${teacher1Mock.id}/files?file_type=OTHER&page=1&page_size=10`,
      otherDocsMocks
    );
    cy.intercept(
      "POST",
      `/users/${teacher1Mock.id}/files/raw?file_type=OTHER&filename=${newOtherrDoc.name}`,
      newOtherrDoc
    );
    cy.intercept(
      "GET",
      `/users/${teacher1Mock.id}/files?file_type=OTHER*`,
      otherDocsMocks
    );
    cy.get('[href="/teachers"]').click();
    cy.getByTestid("main-search-filter").type(teacher1Mock.first_name);
    cy.contains(teacher1Mock.ref).click();
    cy.getByTestid("teacher-docs-button").click();
    cy.getByTestid("menu-list-action").click();
    cy.contains("Créer").click();
    cy.get("#name").click().type(newOtherrDoc?.name!);
    cy.get('[data-testid="dropzone"]').attachFileToDropZone(
      `docs_import/doc.pdf`
    );
    cy.contains("Enregistrer").click();
    cy.contains("Document créé");
  });
});
