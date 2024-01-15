import {mount, unmount} from "@cypress/react";
import App from "../App";
import {manager1, teacher1, student1} from "./credentials";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import { manager2, student1Mock, studentsMock, whoamiManagerMock } from "./mocks/responses";

describe(specTitle("Student and Manager Can get a certificate for students"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();
    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.intercept("GET", `/managers/${manager2.id}`, manager2).as("getManager1");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as("getStudentsPage");
    cy.intercept("GET", `/students?page=1&page_size=10?ref=${student1Mock.ref}`, [student1Mock]).as("getStudent1");
    cy.wait("@getWhoami");
  });

  it("can edit students", () => {
    cy.wait("@getManager1");
    cy.get('[data-testid="students-menu"]').click()
    cy.get('[href="#/students"]').click()
    cy.wait('@getStudentsPage')
    cy.get('[data-testid="main-search-filter"]').type(student1Mock.ref)
    cy.wait('@getStudent1')
    cy.contains(student1Mock.ref).click()
    cy.wait('@getStudent1')
    cy.get('[data-testid="get-certificate-btn"]').click()
  });
  
  afterEach(()=>{
    unmount()
  })
});
