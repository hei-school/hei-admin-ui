import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Monitors", () => {
  beforeEach(() => {
    cy.login({role: "MONITOR"});
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
    cy.intercept(
      "GET",
      `*/monitors/${monitor1Mock.id}/students?page=1&page_size=10`,
      studentsMock
    ).as("getStudents");

    cy.get('[href="#/monitors/monitor1_id/students"]').click();
    cy.wait("@getStudents");

    cy.get(`[href="#/monitor-students/${student1Mock.id}/show"]`).click();
    cy.get("#main-content")
      .should("contain", student1Mock.ref)
      .and("contain", student1Mock.first_name)
      .and("contain", student1Mock.last_name);
  });

  // it("monitors can link students", () => {
  //   cy.intercept(
  //     "GET",
  //     `*/monitors/${monitor1Mock.id}/students?page=1&page_size=10`,
  //     studentsMock
  //   ).as("getStudents");

  //   cy.intercept(
  //     "PUT",
  //     `*/monitors/${monitor1Mock.id}/students`,
  //     {body: {message: "Étudiants liés avec succès"}}
  //   ).as("linkStudents");

  //   cy.get('[href="#/monitors/monitor1_id/students"]').click();
  //   cy.wait("@getStudents");

  //   cy.getByTestid("menu-list-action").click();
  //   cy.getByTestid("create-button").click();

  //   cy.get('input[type="checkbox"]').check();

  //   cy.contains("Ajouter").click();

  //   cy.wait("@linkStudents");

  //   cy.get(".notification")
  //     .should("contain", "Étudiants liés avec succès")
  //     .and("be.visible");

  //   cy.get("#main-content")
  //     .should("contain", student1Mock.ref)
  //     .and("contain", student1Mock.first_name)
  //     .and("contain", student1Mock.last_name);
  // });
});
