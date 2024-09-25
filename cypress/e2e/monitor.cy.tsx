import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Monitors", () => {
  beforeEach(() => {
    cy.login({ role: "MONITOR" });
  });

  it("lands on profile page if succeeds", () => {
    cy.get('[href="#/profile"] > .MuiBox-root').click();
    cy.get("#ha-menu")
      .should("not.contain", "Moniteur")
      .and("contain", "Étudiants");
    cy.get("#main-content")
      .should("contain", monitor1Mock.ref)
      .and("contain", monitor1Mock.last_name)
      .and("contain", monitor1Mock.first_name);
  });

  it("monitors can see a student's details", () => {
    cy.intercept("GET", `/monitors/${monitor1Mock.id}/students?page=1&page_size=10`, studentsMock).as("getStudents");
    
    cy.visit(`http://localhost:5174/#/monitors/${monitor1Mock.id}/students`);
    cy.wait("@getStudents");

    cy.get("#main-content")
      .should("contain", student1Mock.ref)
      .and("contain", student1Mock.first_name)
      .and("contain", student1Mock.last_name)
  });

  it("monitors can see docs students details", () => {
    // TO DO
  })
});
