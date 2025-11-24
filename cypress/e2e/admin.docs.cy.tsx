import {EnableStatus, WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {
  newOtherrDoc,
  otherDocsMocks,
  transcriptsMock,
} from "../fixtures/api_mocks/docs-mocks";
import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";
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

describe("Monitor Student", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MONITOR});
    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/students?page=*&page_size=*`,
      [student1Mock]
    ).as("getStudents");
    cy.intercept("GET", `/students/${student1Mock.id}/level`, "L1").as(
      "getStudentLevel"
    );
  });

  describe("Monitor Student Documents", () => {
    describe("View Student Document", () => {
      beforeEach(() => {
        cy.intercept(
          "GET",
          `/monitors/${monitor1Mock.id}/students/${student1Mock.id}`,
          student1Mock
        ).as("getStudent");
        cy.intercept(
          "GET",
          `/users/${student1Mock.id}/files?file_type=TRANSCRIPT&page=*&page_size=*`,
          transcriptsMock
        ).as("getStudentDocs");
      });
      it("can view a student document", () => {
        cy.getByTestid("students-menu").click();
        cy.contains(student1Mock.ref).click();
        cy.getByTestid("docs-button").click();
        cy.contains("Bulletins").click();
        cy.contains(transcriptsMock[0]?.name!);
        cy.contains(transcriptsMock[1]?.name!);
      });
    });

    describe("View Suspended Student", () => {
      beforeEach(() => {
        cy.intercept(
          "GET",
          `/monitors/${monitor1Mock.id}/students/${student1Mock.id}`,
          {...student1Mock, status: EnableStatus.SUSPENDED}
        ).as("getSuspendedStudent");

        cy.intercept("GET", `/students/${student1Mock.id}`, {
          ...student1Mock,
          status: EnableStatus.SUSPENDED,
        }).as("getSuspendedStudentDetails");
        cy.getByTestid("students-menu").click();
        cy.contains(student1Mock.ref).click();
      });
      it(`can't view student documents and sees suspended alert`, () => {
        cy.intercept(
          "GET",
          `/users/${student1Mock.id}/files?file_type=TRANSCRIPT&page=*&page_size=*`,
          transcriptsMock
        ).as("getStudentDocs");

        cy.getByTestid("docs-button").click();
        cy.contains("Bulletins").click();
        cy.contains("ACCÈS SUSPENDU");
        cy.contains(
          `${student1Mock.first_name} ${student1Mock.last_name} est actuellement suspendu`
        );
        cy.contains(`Vous n'avez pas accès à ces documents.`);
        cy.getByTestid("toggle-details-button").click();
        cy.contains("Raison de la suspension");
        cy.contains("Frais de scolarité impayés");
        cy.contains("Contactez l'administration pour plus d'informations");
      });

      it(`can't view student grades and sees suspended alert`, () => {
        cy.intercept("GET", `/students/student1_id/yearly_results/L1`, {
          statusCode: 200,
        }).as("getStudentGrades");
        cy.getByTestid("grades-tab").click();
        cy.contains("ACCÈS SUSPENDU");
        cy.contains(
          `${student1Mock.first_name} ${student1Mock.last_name} est actuellement suspendu`
        );
        cy.contains(
          `Les notes ne sont pas disponibles dans le tableau de bord`
        );
        cy.getByTestid("toggle-details-button").click();
        cy.contains("Raison de la suspension");
        cy.contains("Frais de scolarité impayés");
        cy.contains(
          "Veuillez contacter l'administration pour plus d'informations sur cette suspension"
        );
      });
    });
  });
});
