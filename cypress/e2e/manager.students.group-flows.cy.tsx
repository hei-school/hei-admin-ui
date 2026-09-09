import {
  group1Mock,
  group2Mock,
  groupsMock,
  studentGroupFlowsMock,
  updatedStudentGroupFlowMock,
} from "../fixtures/api_mocks/groups-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Manager.Students.GroupFlows", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students?page=*&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept(
      "GET",
      `/students?page=*&page_size=*&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept("GET", `/students/${student1Mock.id}/level`, "L1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/group_flows`,
      studentGroupFlowsMock
    ).as("getStudentGroupFlows");
    cy.intercept("GET", `/groups/${group1Mock.id}`, group1Mock);
    cy.intercept("GET", `/groups/${group2Mock.id}`, group2Mock);
    cy.intercept("GET", "/groups?*", groupsMock);
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.wait("@getStudents");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
    cy.getByTestid("group-flows-tab").click();
    cy.wait("@getStudentGroupFlows");
  });

  it("lists the student's group flows with a Rejoint/Quitté badge and the group ref", () => {
    cy.get("table tbody tr")
      .eq(0)
      .within(() => {
        cy.getByTestid("group-flow-move-type").should("contain", "Rejoint");
        cy.contains(group2Mock.ref!);
      });
    cy.get("table tbody tr")
      .eq(1)
      .within(() => {
        cy.getByTestid("group-flow-move-type").should("contain", "Quitté");
        cy.contains(group1Mock.ref!);
      });
  });

  it("colors the Rejoint badge green and the Quitté badge red", () => {
    cy.get("table tbody tr")
      .eq(0)
      .find('[data-testid="group-flow-move-type"]')
      .should("have.class", "MuiChip-colorSuccess");
    cy.get("table tbody tr")
      .eq(1)
      .find('[data-testid="group-flow-move-type"]')
      .should("have.class", "MuiChip-colorError");
  });

  it("can edit a group flow's group and date", () => {
    cy.intercept(
      "PUT",
      `/group_flows/${studentGroupFlowsMock[0].id}`,
      updatedStudentGroupFlowMock
    ).as("updateGroupFlow");

    cy.get("table tbody tr")
      .eq(0)
      .find('[data-testid="edit-group-flow"]')
      .click();

    cy.get('[role="dialog"]').within(() => {
      cy.getByTestid("group-flow-group-select").click();
    });
    cy.contains(group1Mock.ref!).click();
    cy.get("#flow_datetime").clear().type("2024-03-15T08:00");
    cy.contains("Enregistrer").click();

    cy.wait("@updateGroupFlow")
      .its("request.body")
      .should("deep.include", {group_id: group1Mock.id});
    cy.contains("Historique de groupe modifié avec succès");
  });
});
