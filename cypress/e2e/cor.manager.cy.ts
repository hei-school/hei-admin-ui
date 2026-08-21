import {formatDate} from "@/utils/date";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {corMock, corMock1} from "../fixtures/api_mocks/cor-mock";
import {studentsMock} from "../fixtures/api_mocks/students-mocks";
import {teachersMock} from "../fixtures/api_mocks/teachers-mocks";

describe("Cor Manager", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
    cy.intercept("GET", "/cors?page=*&page_size=*", corMock).as("getCor");
    cy.intercept("PUT", `/students/${corMock[0].concerned_student?.id}/cors`, {
      id: "string",
      description: "Updated description",
      interview_date: "2025-12-03T10:30:00.000Z",
      concerned_student_id: corMock[0].concerned_student?.id,
    }).as("updateCor");
    cy.intercept("GET", `/cors/${corMock[0].id}`, corMock[0]).as(
      "getCorDetails"
    );
    cy.visit("/cor");
  });

  it("should display the cor list", () => {
    cy.get(".cor-list .MuiTableBody-root.datagrid-body.RaDatagrid-tbody")
      .first()
      .within(() => {
        cy.contains(corMock[0].concerned_student?.ref!).should("be.visible");
        cy.contains(corMock[0].concerned_student?.first_name!).should(
          "be.visible"
        );
        cy.contains(corMock[0].concerned_student?.last_name!).should(
          "be.visible"
        );
        cy.contains(corMock[0].interviewers?.[0].first_name!).should(
          "be.visible"
        );
        cy.contains(corMock[0].description!).should("be.visible");
        cy.contains(formatDate(corMock[0].creation_datetime)).should(
          "be.visible"
        );
        cy.contains(formatDate(corMock[0].interview_date)).should("be.visible");
      });
  });
  it("should display the cor details", () => {
    cy.getByTestid("show-button").first().click();
    cy.wait("@getCorDetails");
    cy.contains(corMock1.description!).should("be.visible");
    cy.contains(formatDate(corMock1.creation_datetime)).should("be.visible");
    cy.contains(formatDate(corMock1.interview_date)).should("be.visible");
    corMock1.interviewers?.forEach((interviewer) => {
      cy.getByTestid("interviewer-chip")
        .contains(interviewer.first_name!)
        .should("be.visible");
    });
    cy.contains(corMock1.concerned_student?.first_name!).should("be.visible");
    cy.contains(corMock1.concerned_student?.last_name!).should("be.visible");
    cy.contains(corMock1.concerned_student?.ref!).should("be.visible");
  });

  it("should add a comment to the cor", () => {
    cy.intercept("POST", `/cors/${corMock[0].id}/comment`, {
      status: "IN_PROGRESS",
      comment: "string",
      creation_date: "2025-10-03T19:25:55.967Z",
    });
    cy.getByTestid("add-cor-comment").first().click();
    cy.get("#comment").type("This is a test comment");
    cy.contains("Enregistrer").click();
    cy.contains("Commentaire ajouté avec succès").should("be.visible");
  });
  it("should edit a cor", () => {
    cy.intercept("PUT", `/students/${corMock[0].concerned_student?.id}/cors`, {
      id: "string",
      description: "Updated description",
      interview_date: "2025-12-03T10:30:00.000Z",
      status: "LEAVE",
      concerned_student_id: corMock[0].concerned_student?.id,
      interviewer_ids: [
        corMock[0].interviewers?.[0].id!,
        corMock[1].interviewers?.[1].id!,
      ],
    }).as("updateCor");
    cy.getByTestid("edit-cor").first().click();
    cy.get("#description").clear().type("Updated description");
    cy.getByTestid("cor-status").click();
    cy.get('[data-value="LEAVE"]').click();
    cy.contains("Enregistrer").click();
    cy.contains("COR modifié avec succès").should("be.visible");
  });

  it("can create new cor", () => {
    cy.intercept("GET", `/students?page=*&page_size=*`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/teachers?page=*&page_size=*`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `/teachers/${teachersMock[0].id}`, teachersMock[0]).as(
      "getTeacher1"
    );
    cy.intercept("GET", `/teachers/${teachersMock[1].id}`, teachersMock[1]).as(
      "getTeacher2"
    );
    cy.intercept("GET", `/students/${studentsMock[0].id}`, studentsMock[0]).as(
      "getStudent1"
    );
    cy.intercept("PUT", `/students/${studentsMock[0].id}/cors`, {
      id: "string",
      description: "Updated description",
      interview_date: "2025-12-03T10:30:00.000Z",
      concerned_student_id: studentsMock[0].id,
    }).as("createCor");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.get("#description").type("New description");
    cy.get("#interview_date").type("2025-12-03T10:30");
    cy.getByTestid("cor-status").click();
    cy.get('[data-value="LEAVE"]').click();
    cy.getByTestid("student-autocomplete").type(studentsMock[0].ref!);
    cy.wait("@getStudentsPage1");
    cy.get(".MuiAutocomplete-popper li").first().click();
    cy.wait("@getStudent1");
    cy.getByTestid("custom-autocomplete-array-input").type(
      teachersMock[0].first_name!
    );
    cy.get(".MuiAutocomplete-popper li").first().click();
    cy.getByTestid("custom-autocomplete-array-input").type(
      teachersMock[1].first_name!
    );
    cy.get(".MuiAutocomplete-popper li").first().click();
    cy.contains("Enregistrer").click();
    cy.wait("@createCor");
    cy.contains("COR créer avec succès").should("be.visible");
  });
});
