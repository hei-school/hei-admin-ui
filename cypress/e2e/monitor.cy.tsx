import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Monitors", () => {
  beforeEach(() => {
    cy.mockLogin({role: "MONITOR"});
  });

  it("lands on profile page if succeeds", () => {
    cy.get('[href="/profile"] > .MuiBox-root').click();
    cy.get("#ha-menu")
      .should("not.contain", "Moniteur")
      .and("contain", "Étudiants");
    cy.get("#main-content")
      .should("contain", monitor1Mock.ref)
      .and("contain", monitor1Mock.last_name)
      .and("contain", monitor1Mock.first_name);
  });

  it("monitors can see a student's details", () => {
    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/students?page=1&page_size=10`,
      studentsMock
    ).as("getStudents");
    cy.intercept(
      "GET",
      `/monitors/${monitor1Mock.id}/students?page=2&page_size=10`,
      studentsMock
    ).as("getStudents2");

    cy.get('[href="/monitors/monitor1_id/students"]').click();
    cy.wait("@getStudents");

    cy.get(`[href="/monitor-students/${student1Mock.id}/show"]`).click();
    cy.get("#main-content")
      .should("contain", student1Mock.ref)
      .and("contain", student1Mock.first_name)
      .and("contain", student1Mock.last_name);
  });
});
