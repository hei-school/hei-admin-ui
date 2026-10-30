import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";
import {complaintMock} from "../fixtures/api_mocks/complaint-mock";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const STUDENT_ID = student1Mock.id;

describe("Complaints Student", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.STUDENT});
    cy.intercept(
      "GET",
      `/students/${STUDENT_ID}/complaints?*`,
      complaintMock
    ).as("getStudentComplaints");
    cy.visit("/student-complaints");
    cy.wait("@getStudentComplaints");
  });

  it("should display the student's own complaints", () => {
    cy.contains(complaintMock[0].title!).should("be.visible");
    cy.contains(complaintMock[1].title!).should("be.visible");
  });

  it("should filter the student's complaints by type and status", () => {
    cy.getByTestid("filter-complaint-type").click();
    cy.get('[data-value="FINANCIAL"]').click();
    cy.wait("@getStudentComplaints");

    cy.contains(complaintMock[1].title!).should("be.visible");
    cy.contains(complaintMock[0].title!).should("not.exist");
  });

  it("should create a new complaint", () => {
    cy.intercept("POST", "/complaints", {
      id: "COMPLAINT_NEW",
      type: "ACADEMIC",
      title: "Erreur de planning",
      description: "Mon créneau d'examen a été modifié sans préavis.",
      status: "CREATED",
    }).as("createComplaint");

    cy.getByTestid("create-complaint").click();
    cy.getByTestid("complaint-type").click();
    cy.get('[data-value="ACADEMIC"]').click();
    cy.get("#title").type("Erreur de planning");
    cy.get("#description").type(
      "Mon créneau d'examen a été modifié sans préavis."
    );
    cy.contains("Enregistrer").click();
    cy.wait("@createComplaint");
    cy.contains("Réclamation déposée avec succès").should("be.visible");
  });
});
